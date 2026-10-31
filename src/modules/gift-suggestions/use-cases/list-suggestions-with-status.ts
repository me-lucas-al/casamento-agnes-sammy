import { requireRole } from "@/modules/auth/authorization";
import type { SessionUser } from "@/modules/auth/types";
import { GIFT_MANAGER_ROLES } from "@/modules/gifts/lib/gift-roles";
import { buildPageResult, type PageResult } from "@/shared/lib/pagination";
import { normalizeGiftName } from "../lib/normalize-gift-name";
import { selectSuggestions } from "../lib/query-suggestions";
import type { SuggestionQuery } from "../lib/suggestion-query";
import type { SuggestionGiftGateway } from "../ports";
import type { GiftSuggestion, SuggestionWithStatus } from "../types";

type Dependencies = {
  gateway: SuggestionGiftGateway;
  catalog: readonly GiftSuggestion[];
};

export function makeListSuggestionsWithStatus({ gateway, catalog }: Dependencies) {
  return async function listSuggestionsWithStatus(
    actor: SessionUser | null,
    query: SuggestionQuery,
  ): Promise<PageResult<SuggestionWithStatus>> {
    requireRole(actor, GIFT_MANAGER_ROLES);
    const existingNames = new Set((await gateway.listGiftNames()).map(normalizeGiftName));
    const matching = selectSuggestions(catalog, query);
    const { page, perPage, offset } = query;
    const items = matching.slice(offset, offset + perPage).map((suggestion) => ({
      ...suggestion,
      alreadyInList: existingNames.has(normalizeGiftName(suggestion.name)),
    }));
    return buildPageResult({ items, total: matching.length, page, perPage });
  };
}
