import type { GiftMode } from "@/modules/gifts/types";
import { PRICE_BANDS, type PriceBandId } from "@/modules/gifts/lib/pricing/price-band";
import type { SuggestionSort } from "../filters/suggestion-query";

export const MODE_BADGE_LABELS: Record<GiftMode, string> = {
  single: "item",
  fixed_quotas: "cotas",
  free_amount: "valor livre",
};

export const MODE_FILTER_OPTIONS = [
  { value: "item", label: "Item único" },
  { value: "cotas", label: "Em cotas" },
  { value: "livre", label: "Valor livre" },
] as const;

export const SORT_LABELS: Record<SuggestionSort, string> = {
  relevancia: "Relevância",
  "menor-preco": "Menor preço",
  "maior-preco": "Maior preço",
  "a-z": "A a Z",
};

export function priceBandLabel(bandId: PriceBandId): string {
  return PRICE_BANDS.find((band) => band.id === bandId)?.label ?? "";
}
