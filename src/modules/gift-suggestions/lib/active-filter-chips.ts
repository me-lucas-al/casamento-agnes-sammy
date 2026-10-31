import { formatCentsAsBrl } from "@/shared/lib/money";
import type { QueryChanges } from "@/shared/lib/url-params";
import { categoryNameOf } from "../data/category-names";
import { PRODUCT_TYPE_LABELS } from "../data/product-types";
import { STORE_LABELS } from "../data/stores";
import { MODE_BADGE_LABELS, priceBandLabel } from "./suggestion-labels";
import type { SuggestionQuery } from "./suggestion-query";

export type FilterChip = {
  id: string;
  label: string;
  removal: QueryChanges;
};

function describePriceRange(query: SuggestionQuery): string | null {
  const { minPriceCents, maxPriceCents } = query;
  if (minPriceCents !== undefined && maxPriceCents !== undefined) {
    return `${formatCentsAsBrl(minPriceCents)} a ${formatCentsAsBrl(maxPriceCents)}`;
  }
  if (minPriceCents !== undefined) return `A partir de ${formatCentsAsBrl(minPriceCents)}`;
  if (maxPriceCents !== undefined) return `Até ${formatCentsAsBrl(maxPriceCents)}`;
  return null;
}

export function buildActiveFilterChips(query: SuggestionQuery): FilterChip[] {
  const chips: FilterChip[] = [];
  if (query.q) chips.push({ id: "q", label: `Busca: ${query.q}`, removal: { q: null } });
  if (query.category) chips.push({ id: "categoria", label: categoryNameOf(query.category), removal: { categoria: null } });
  if (query.type) chips.push({ id: "tipo", label: PRODUCT_TYPE_LABELS[query.type], removal: { tipo: null } });
  for (const store of query.stores) {
    const remaining = query.stores.filter((candidate) => candidate !== store);
    chips.push({ id: `loja-${store}`, label: STORE_LABELS[store], removal: { loja: remaining.join(",") || null } });
  }
  if (query.band) chips.push({ id: "faixa", label: priceBandLabel(query.band), removal: { faixa: null } });
  const priceRange = describePriceRange(query);
  if (priceRange) chips.push({ id: "preco", label: priceRange, removal: { precoMin: null, precoMax: null } });
  if (query.mode) chips.push({ id: "modo", label: `Modo: ${MODE_BADGE_LABELS[query.mode]}`, removal: { modo: null } });
  return chips;
}
