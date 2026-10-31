import { describe, expect, it } from "vitest";
import { GIFT_SUGGESTION_CATALOG } from "@/modules/gift-suggestions/data/gift-suggestion-catalog";
import { invalidateSuggestionCaches } from "@/modules/gift-suggestions/lib/caches/invalidate-suggestion-caches";
import { FakeCacheInvalidator } from "@/tests/helpers/fakes/fake-cache-invalidator";
import { asUser } from "@/tests/helpers/fakes/fake-session";
import { seedGift, seedGiftCategory } from "@/tests/helpers/database/seeds/seed-gift";
import { useTestDatabase } from "@/tests/helpers/database/use-test-database";
import { PAGE_ONE } from "../gifts/gift-test-module";
import { createTestSuggestionModule, idOf, FIRST_PRODUCT_NAME, SECOND_PRODUCT_NAME, THIRD_PRODUCT_NAME } from "./gift-suggestion-test-module";

const KITCHEN = "Cozinha & Eletrodomésticos";

describe("addSuggestedGifts", () => {
  const testDatabase = useTestDatabase();
  const couple = asUser("couple");

  async function listAllGifts(giftModule: ReturnType<typeof createTestSuggestionModule>["giftModule"]) {
    return giftModule.listPanelGiftsPage(couple, { ...PAGE_ONE, perPage: 1000, search: "", sort: "name" });
  }

  it("adds into an existing category without creating a duplicate category", async () => {
    const { suggestionModule, giftModule } = createTestSuggestionModule(testDatabase.db);
    const category = await seedGiftCategory(testDatabase.db, { name: KITCHEN });

    const result = await suggestionModule.addSuggestedGifts(couple, [idOf(FIRST_PRODUCT_NAME)]);

    const categories = await giftModule.categoryRepository.list();
    const { items } = await listAllGifts(giftModule);
    expect(result).toEqual({ createdCount: 1, skippedIds: [], failedIds: [] });
    expect(categories).toHaveLength(1);
    expect(items[0]).toMatchObject({ name: FIRST_PRODUCT_NAME, categoryId: category.id, isVisible: true });
  });

  it("copies product link, photo, store, price date and exact price into the gift", async () => {
    const { suggestionModule, giftModule } = createTestSuggestionModule(testDatabase.db);
    const suggestion = GIFT_SUGGESTION_CATALOG.find((candidate) => candidate.name === FIRST_PRODUCT_NAME);

    await suggestionModule.addSuggestedGifts(couple, [idOf(FIRST_PRODUCT_NAME)]);

    const [gift] = (await listAllGifts(giftModule)).items;
    expect(gift).toMatchObject({
      priceCents: suggestion?.priceCents,
      productUrl: suggestion?.productUrl,
      externalImageUrl: suggestion?.imageUrl,
      storeName: suggestion?.storeName,
      priceCheckedAt: suggestion?.priceCheckedAt,
    });
  });

  it("creates missing categories by name with their default order", async () => {
    const { suggestionModule, giftModule } = createTestSuggestionModule(testDatabase.db);

    await suggestionModule.addSuggestedGifts(couple, [idOf("Pizza da primeira DR resolvida"), idOf(FIRST_PRODUCT_NAME)]);

    const categories = await giftModule.categoryRepository.list();
    expect(categories.map((category) => [category.name, category.sortOrder])).toEqual([
      [KITCHEN, 0],
      ["Divertidos / Zoeira", 5],
    ]);
  });

  it("skips gifts already in the list, ignoring case and accents", async () => {
    const { suggestionModule, giftModule } = createTestSuggestionModule(testDatabase.db);
    await seedGift(testDatabase.db, { name: FIRST_PRODUCT_NAME.toUpperCase() });
    await seedGift(testDatabase.db, { name: SECOND_PRODUCT_NAME.toLowerCase() });
    const ids = [idOf(FIRST_PRODUCT_NAME), idOf(SECOND_PRODUCT_NAME), idOf(THIRD_PRODUCT_NAME)];

    const result = await suggestionModule.addSuggestedGifts(couple, ids);

    expect(result).toEqual({ createdCount: 1, skippedIds: ids.slice(0, 2), failedIds: [] });
    expect((await listAllGifts(giftModule)).total).toBe(3);
  });

  it("is idempotent across calls and ignores repeated or unknown ids", async () => {
    const { suggestionModule, giftModule } = createTestSuggestionModule(testDatabase.db);
    const airFryerId = idOf(FIRST_PRODUCT_NAME);

    const first = await suggestionModule.addSuggestedGifts(couple, [airFryerId, airFryerId, "nao-existe"]);
    const second = await suggestionModule.addSuggestedGifts(couple, [airFryerId]);

    expect(first).toEqual({ createdCount: 1, skippedIds: ["nao-existe"], failedIds: [] });
    expect(second).toEqual({ createdCount: 0, skippedIds: [airFryerId], failedIds: [] });
    expect((await listAllGifts(giftModule)).total).toBe(1);
  });

  it("persists every catalog suggestion respecting the gift mode rules", async () => {
    const { suggestionModule, giftModule } = createTestSuggestionModule(testDatabase.db);

    const result = await suggestionModule.addSuggestedGifts(
      couple,
      GIFT_SUGGESTION_CATALOG.map((suggestion) => suggestion.id),
    );

    const { items } = await listAllGifts(giftModule);
    expect(result.createdCount).toBe(GIFT_SUGGESTION_CATALOG.length);
    expect(result.skippedIds).toEqual([]);
    for (const gift of items) {
      const suggestion = GIFT_SUGGESTION_CATALOG.find((candidate) => candidate.name === gift.name);
      expect(gift).toMatchObject({
        mode: suggestion?.mode,
        kind: suggestion?.kind,
        priceCents: suggestion?.priceCents,
        totalQuotas: suggestion?.totalQuotas ?? null,
        minAmountCents: suggestion?.minAmountCents ?? null,
      });
    }
  });

  it("invalidates gifts, categories and dashboard caches", () => {
    const invalidator = new FakeCacheInvalidator();

    invalidateSuggestionCaches(invalidator);

    expect(invalidator.invalidatedTags).toEqual(expect.arrayContaining(["gifts", "gift-categories", "dashboard"]));
    expect(invalidator.invalidatedPaths).toEqual(
      expect.arrayContaining(["/painel/presentes", "/presentes", "/painel/presentes/sugestoes"]),
    );
  });
});
