import { PRODUCT_TYPE_LABELS } from "@/modules/gift-suggestions/data/product-types";
import { STORE_LABELS } from "@/modules/gift-suggestions/data/stores";
import type { GiftSuggestion } from "@/modules/gift-suggestions/types";
import { normalizeGiftName } from "../catalog/normalize-gift-name";
import type { SuggestionFilters, SuggestionSort } from "./suggestion-query";

function searchableText(suggestion: GiftSuggestion): string {
  const storeLabel = suggestion.store ? STORE_LABELS[suggestion.store] : "";
  const parts = [suggestion.name, suggestion.description, suggestion.tags.join(" "), PRODUCT_TYPE_LABELS[suggestion.type], storeLabel];
  return normalizeGiftName(parts.join(" "));
}

function matchesFilters(suggestion: GiftSuggestion, filters: SuggestionFilters, searchTerms: string[]): boolean {
  if (filters.category && suggestion.categoryKey !== filters.category) return false;
  if (filters.type && suggestion.type !== filters.type) return false;
  if (filters.band && suggestion.priceBand !== filters.band) return false;
  if (filters.mode && suggestion.mode !== filters.mode) return false;
  if (filters.stores.length > 0 && (!suggestion.store || !filters.stores.includes(suggestion.store))) return false;
  if (filters.minPriceCents !== undefined && suggestion.priceCents < filters.minPriceCents) return false;
  if (filters.maxPriceCents !== undefined && suggestion.priceCents > filters.maxPriceCents) return false;
  const text = searchableText(suggestion);
  return searchTerms.every((term) => text.includes(term));
}

function relevanceScore(suggestion: GiftSuggestion, normalizedQuery: string): number {
  if (!normalizedQuery) return 0;
  const name = normalizeGiftName(suggestion.name);
  if (name === normalizedQuery) return 4;
  if (name.startsWith(normalizedQuery)) return 3;
  if (name.includes(normalizedQuery)) return 2;
  return suggestion.tags.some((tag) => normalizeGiftName(tag).includes(normalizedQuery)) ? 1 : 0;
}

const SORT_COMPARATORS: Record<Exclude<SuggestionSort, "relevancia">, (a: GiftSuggestion, b: GiftSuggestion) => number> = {
  "menor-preco": (a, b) => a.priceCents - b.priceCents || a.name.localeCompare(b.name, "pt-BR"),
  "maior-preco": (a, b) => b.priceCents - a.priceCents || a.name.localeCompare(b.name, "pt-BR"),
  "a-z": (a, b) => a.name.localeCompare(b.name, "pt-BR"),
};

export function selectSuggestions(catalog: readonly GiftSuggestion[], filters: SuggestionFilters): GiftSuggestion[] {
  const normalizedQuery = normalizeGiftName(filters.q);
  const searchTerms = normalizedQuery.split(" ").filter(Boolean);
  const matching = catalog.filter((suggestion) => matchesFilters(suggestion, filters, searchTerms));
  if (filters.sort !== "relevancia") return matching.sort(SORT_COMPARATORS[filters.sort]);
  return matching
    .map((suggestion, index) => ({ suggestion, index, score: relevanceScore(suggestion, normalizedQuery) }))
    .sort((a, b) => b.score - a.score || a.index - b.index)
    .map(({ suggestion }) => suggestion);
}
