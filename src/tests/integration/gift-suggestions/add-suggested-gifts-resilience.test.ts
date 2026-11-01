import { describe, expect, it } from "vitest";
import { makeAddSuggestedGifts } from "@/modules/gift-suggestions/use-cases/add-suggested-gifts";
import { GIFT_SUGGESTION_CATALOG } from "@/modules/gift-suggestions/data/gift-suggestion-catalog";
import type { SuggestionGiftGateway } from "@/modules/gift-suggestions/ports";
import { asUser } from "@/tests/helpers/fakes/fake-session";
import { useTestDatabase } from "@/tests/helpers/database/use-test-database";
import { PAGE_ONE } from "../gifts/gift-test-module";
import { createTestSuggestionModule, idOf, FIRST_PRODUCT_NAME, SECOND_PRODUCT_NAME, THIRD_PRODUCT_NAME } from "./gift-suggestion-test-module";

const silentLogger = { info: () => undefined, warn: () => undefined, error: () => undefined };

describe("addSuggestedGifts resilience", () => {
  const testDatabase = useTestDatabase();
  const couple = asUser("couple");
  const ids = [idOf(FIRST_PRODUCT_NAME), idOf("Pizza da primeira DR resolvida"), idOf(THIRD_PRODUCT_NAME)];

  it("never duplicates gifts or categories when the same suggestions run concurrently", async () => {
    const { suggestionModule, giftModule } = createTestSuggestionModule(testDatabase.db);

    const results = await Promise.all([
      suggestionModule.addSuggestedGifts(couple, ids),
      suggestionModule.addSuggestedGifts(couple, ids),
      suggestionModule.addSuggestedGifts(couple, ids),
    ]);

    const { items } = await giftModule.listPanelGiftsPage(couple, { ...PAGE_ONE, perPage: 100, search: "", sort: "name" });
    const categories = await giftModule.categoryRepository.list();
    expect(items).toHaveLength(ids.length);
    expect(categories).toHaveLength(2);
    expect(results.reduce((total, result) => total + result.createdCount, 0)).toBe(ids.length);
    expect(results.flatMap((result) => result.failedIds)).toEqual([]);
  });

  it("reports created, skipped and failed counts when a creation fails mid-loop", async () => {
    const failingName = GIFT_SUGGESTION_CATALOG.find((suggestion) => suggestion.id === ids[1])?.name;
    const gateway: SuggestionGiftGateway = {
      listGiftNames: async () => [],
      listEnrichableGifts: async () => [],
      enrichGift: async () => undefined,
      listCategories: async () => [{ id: "category-1", name: GIFT_SUGGESTION_CATALOG[0].categoryName }],
      createCategory: async (name) => ({ id: `created-${name}`, name }),
      createGift: async (_actor, input) => {
        if (input.name === failingName) throw new Error("connection lost");
        return input.name === GIFT_SUGGESTION_CATALOG.find((s) => s.id === ids[2])?.name ? "duplicate" : "created";
      },
    };
    const addSuggestedGifts = makeAddSuggestedGifts({ gateway, catalog: GIFT_SUGGESTION_CATALOG, logger: silentLogger });

    const result = await addSuggestedGifts(couple, [...ids, "nao-existe"]);

    expect(result).toEqual({ createdCount: 1, enrichedCount: 0, skippedIds: [ids[2], "nao-existe"], failedIds: [ids[1]] });
  });

  it("falls back to the existing category when its creation races", async () => {
    const { suggestionModule, giftModule } = createTestSuggestionModule(testDatabase.db);
    const first = suggestionModule.addSuggestedGifts(couple, [idOf(FIRST_PRODUCT_NAME)]);
    const second = suggestionModule.addSuggestedGifts(couple, [idOf(SECOND_PRODUCT_NAME)]);

    const [firstResult, secondResult] = await Promise.all([first, second]);

    expect(firstResult.failedIds).toEqual([]);
    expect(secondResult.failedIds).toEqual([]);
    expect(await giftModule.categoryRepository.list()).toHaveLength(1);
  });
});
