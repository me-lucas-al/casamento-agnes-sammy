export const GIFT_SORT_OPTIONS = ["order", "price-asc", "price-desc", "name", "newest"] as const;

export type GiftSortOption = (typeof GIFT_SORT_OPTIONS)[number];

export const DEFAULT_GIFT_SORT: GiftSortOption = "order";

export const GIFT_SORT_LABELS: Record<GiftSortOption, string> = {
  order: "Ordem da lista",
  "price-asc": "Menor preço",
  "price-desc": "Maior preço",
  name: "Nome (A-Z)",
  newest: "Mais recentes",
};
