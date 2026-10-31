import type { PriceBandId } from "@/modules/gifts/lib/price-band";
import type { GiftSuggestion } from "../types";
import { normalizeGiftName } from "./normalize-gift-name";

export type SuggestionFilters = {
  search: string;
  band?: PriceBandId;
};

function matchesSearch(suggestion: GiftSuggestion, normalizedSearch: string): boolean {
  if (!normalizedSearch) return true;
  const haystack = normalizeGiftName(`${suggestion.name} ${suggestion.description}`);
  return haystack.includes(normalizedSearch);
}

export function filterSuggestions<Suggestion extends GiftSuggestion>(
  suggestions: readonly Suggestion[],
  filters: SuggestionFilters,
): Suggestion[] {
  const normalizedSearch = normalizeGiftName(filters.search);
  return suggestions.filter(
    (suggestion) =>
      matchesSearch(suggestion, normalizedSearch) && (!filters.band || suggestion.priceBand === filters.band),
  );
}
