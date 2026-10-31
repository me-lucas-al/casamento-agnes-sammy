import { requireRole } from "@/modules/auth/authorization";
import type { SessionUser } from "@/modules/auth/types";
import { GIFT_MANAGER_ROLES } from "@/modules/gifts/lib/gift-roles";
import { buildGiftInputFromSuggestion } from "../lib/build-gift-input-from-suggestion";
import { normalizeGiftName } from "../lib/normalize-gift-name";
import type { SuggestionGiftGateway } from "../ports";
import type { AddSuggestionsResult, GiftSuggestion } from "../types";

type Dependencies = {
  gateway: SuggestionGiftGateway;
  catalog: readonly GiftSuggestion[];
};

export function makeAddSuggestedGifts({ gateway, catalog }: Dependencies) {
  return async function addSuggestedGifts(
    actor: SessionUser | null,
    suggestionIds: readonly string[],
  ): Promise<AddSuggestionsResult> {
    const manager = requireRole(actor, GIFT_MANAGER_ROLES);
    const usedNames = new Set((await gateway.listGiftNames()).map(normalizeGiftName));
    const categoryIdByName = new Map((await gateway.listCategories()).map((category) => [category.name, category.id]));
    const skippedIds: string[] = [];
    let createdCount = 0;

    async function resolveCategoryId(categoryName: string): Promise<string> {
      const knownId = categoryIdByName.get(categoryName);
      if (knownId) return knownId;
      const created = await gateway.createCategory(categoryName);
      categoryIdByName.set(categoryName, created.id);
      return created.id;
    }

    for (const suggestionId of new Set(suggestionIds)) {
      const suggestion = catalog.find((candidate) => candidate.id === suggestionId);
      const normalizedName = suggestion ? normalizeGiftName(suggestion.name) : "";
      if (!suggestion || usedNames.has(normalizedName)) {
        skippedIds.push(suggestionId);
        continue;
      }
      const categoryId = await resolveCategoryId(suggestion.categoryName);
      await gateway.createGift(manager, buildGiftInputFromSuggestion(suggestion, categoryId));
      usedNames.add(normalizedName);
      createdCount += 1;
    }
    return { createdCount, skippedIds };
  };
}
