import { requireRole } from "@/modules/auth/authorization";
import type { SessionUser } from "@/modules/auth/types";
import { GIFT_MANAGER_ROLES } from "@/modules/gifts/lib/roles/gift-roles";
import type { Logger } from "@/shared/lib/logging/logger";
import { serializeError } from "@/shared/lib/logging/serialize-error";
import { buildGiftInputFromSuggestion } from "../lib/catalog/build-gift-input-from-suggestion";
import { normalizeGiftName } from "../lib/catalog/normalize-gift-name";
import type { SuggestionGiftGateway } from "../ports";
import type { AddSuggestionsResult, GiftSuggestion } from "../types";

type Dependencies = {
  gateway: SuggestionGiftGateway;
  catalog: readonly GiftSuggestion[];
  logger: Logger;
};

export function makeAddSuggestedGifts({ gateway, catalog, logger }: Dependencies) {
  return async function addSuggestedGifts(
    actor: SessionUser | null,
    suggestionIds: readonly string[],
  ): Promise<AddSuggestionsResult> {
    const manager = requireRole(actor, GIFT_MANAGER_ROLES);
    const usedNames = new Set((await gateway.listGiftNames()).map(normalizeGiftName));
    const categoryIdByName = new Map((await gateway.listCategories()).map((category) => [category.name, category.id]));
    const result: AddSuggestionsResult = { createdCount: 0, skippedIds: [], failedIds: [] };

    async function resolveCategoryId(categoryName: string): Promise<string> {
      const knownId = categoryIdByName.get(categoryName);
      if (knownId) return knownId;
      const category = await gateway.createCategory(categoryName);
      categoryIdByName.set(categoryName, category.id);
      return category.id;
    }

    async function addOne(suggestion: GiftSuggestion, normalizedName: string) {
      const categoryId = await resolveCategoryId(suggestion.categoryName);
      const outcome = await gateway.createGift(manager, buildGiftInputFromSuggestion(suggestion, categoryId));
      usedNames.add(normalizedName);
      if (outcome === "duplicate") return result.skippedIds.push(suggestion.id);
      result.createdCount += 1;
    }

    for (const suggestionId of new Set(suggestionIds)) {
      const suggestion = catalog.find((candidate) => candidate.id === suggestionId);
      const normalizedName = suggestion ? normalizeGiftName(suggestion.name) : "";
      if (!suggestion || usedNames.has(normalizedName)) {
        result.skippedIds.push(suggestionId);
        continue;
      }
      try {
        await addOne(suggestion, normalizedName);
      } catch (error) {
        logger.error("gift_suggestions.add_failed", { suggestionId, error: serializeError(error) });
        result.failedIds.push(suggestionId);
      }
    }
    return result;
  };
}
