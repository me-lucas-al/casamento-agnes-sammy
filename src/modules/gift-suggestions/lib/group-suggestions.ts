import { SUGGESTION_CATEGORY_ORDER } from "../data/category-names";
import type { GiftSuggestion, SuggestionGroup } from "../types";

export function groupSuggestionsByCategory<Suggestion extends GiftSuggestion>(
  suggestions: readonly Suggestion[],
): SuggestionGroup<Suggestion>[] {
  return SUGGESTION_CATEGORY_ORDER.flatMap((categoryName) => {
    const inCategory = suggestions.filter((suggestion) => suggestion.categoryName === categoryName);
    return inCategory.length > 0 ? [{ categoryName, suggestions: inCategory }] : [];
  });
}
