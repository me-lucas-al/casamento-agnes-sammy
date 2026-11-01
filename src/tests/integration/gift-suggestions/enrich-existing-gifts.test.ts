import { describe, expect, it } from "vitest";
import { GIFT_SUGGESTION_CATALOG } from "@/modules/gift-suggestions/data/gift-suggestion-catalog";
import { seedContribution } from "@/tests/helpers/database/seeds/seed-contribution";
import { seedGift } from "@/tests/helpers/database/seeds/seed-gift";
import { useTestDatabase } from "@/tests/helpers/database/use-test-database";
import { asUser } from "@/tests/helpers/fakes/fake-session";
import { PAGE_ONE } from "../gifts/gift-test-module";
import { createTestSuggestionModule, idOf, FIRST_PRODUCT_NAME } from "./gift-suggestion-test-module";

describe("addSuggestedGifts enrichment", () => {
  const testDatabase = useTestDatabase();
  const couple = asUser("couple");
  const suggestion = GIFT_SUGGESTION_CATALOG.find((candidate) => candidate.name === FIRST_PRODUCT_NAME);

  async function listGifts(giftModule: ReturnType<typeof createTestSuggestionModule>["giftModule"]) {
    return (await giftModule.listPanelGiftsPage(couple, { ...PAGE_ONE, perPage: 100, search: "", sort: "name" })).items;
  }

  it("fills product data of a bare gift with the same name and takes the suggested price", async () => {
    const { suggestionModule, giftModule } = createTestSuggestionModule(testDatabase.db);
    const bare = await seedGift(testDatabase.db, { name: FIRST_PRODUCT_NAME.toUpperCase(), priceCents: 1000 });

    const result = await suggestionModule.addSuggestedGifts(couple, [idOf(FIRST_PRODUCT_NAME)]);

    const gifts = await listGifts(giftModule);
    expect(result).toEqual({ createdCount: 0, enrichedCount: 1, skippedIds: [], failedIds: [] });
    expect(gifts).toHaveLength(1);
    expect(gifts[0]).toMatchObject({
      id: bare.id,
      name: FIRST_PRODUCT_NAME.toUpperCase(),
      productUrl: suggestion?.productUrl,
      externalImageUrl: suggestion?.imageUrl,
      storeName: suggestion?.storeName,
      priceCheckedAt: suggestion?.priceCheckedAt,
      priceCents: suggestion?.priceCents,
    });
  });

  it("keeps the price when the gift already has active contributions", async () => {
    const { suggestionModule, giftModule } = createTestSuggestionModule(testDatabase.db);
    const bare = await seedGift(testDatabase.db, { name: FIRST_PRODUCT_NAME, priceCents: 1000, mode: "single" });
    await seedContribution(testDatabase.db, { giftId: bare.id, status: "confirmed" });

    const result = await suggestionModule.addSuggestedGifts(couple, [idOf(FIRST_PRODUCT_NAME)]);

    const [gift] = await listGifts(giftModule);
    expect(result.enrichedCount).toBe(1);
    expect(gift).toMatchObject({ priceCents: 1000, productUrl: suggestion?.productUrl, storeName: suggestion?.storeName });
  });

  it("skips a gift that already has a product link or an uploaded image", async () => {
    const { suggestionModule, giftModule } = createTestSuggestionModule(testDatabase.db);
    await seedGift(testDatabase.db, { name: FIRST_PRODUCT_NAME, productUrl: "https://www.amazon.com.br/dp/B0AAA" });

    const result = await suggestionModule.addSuggestedGifts(couple, [idOf(FIRST_PRODUCT_NAME)]);

    const [gift] = await listGifts(giftModule);
    expect(result).toEqual({ createdCount: 0, enrichedCount: 0, skippedIds: [idOf(FIRST_PRODUCT_NAME)], failedIds: [] });
    expect(gift.productUrl).toBe("https://www.amazon.com.br/dp/B0AAA");
  });

  it("enriches only once when the same id is sent twice", async () => {
    const { suggestionModule } = createTestSuggestionModule(testDatabase.db);
    await seedGift(testDatabase.db, { name: FIRST_PRODUCT_NAME });
    const id = idOf(FIRST_PRODUCT_NAME);

    const first = await suggestionModule.addSuggestedGifts(couple, [id]);
    const second = await suggestionModule.addSuggestedGifts(couple, [id]);

    expect(first.enrichedCount).toBe(1);
    expect(second).toEqual({ createdCount: 0, enrichedCount: 0, skippedIds: [id], failedIds: [] });
  });
});
