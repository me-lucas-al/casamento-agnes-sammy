import { PRICE_BANDS, isPriceInBand, type PriceBandId } from "@/modules/gifts/lib/price-band";
import type { GiftKind } from "@/modules/gifts/types";
import type { GiftSuggestion } from "../types";

type BaseFields = {
  id: string;
  name: string;
  description: string;
  priceCents: number;
};

type SuggestionFactory = (fields: BaseFields) => GiftSuggestion;

function bandOf(priceCents: number): PriceBandId {
  const band = PRICE_BANDS.find((candidate) => isPriceInBand(priceCents, candidate));
  if (!band) throw new Error(`No price band for ${priceCents}`);
  return band.id;
}

export function singleSuggestions(categoryName: string, kind: GiftKind): SuggestionFactory {
  return (fields) => ({ ...fields, categoryName, kind, mode: "single", priceBand: bandOf(fields.priceCents) });
}

export function quotaSuggestions(categoryName: string, kind: GiftKind) {
  return (fields: BaseFields, totalQuotas: number): GiftSuggestion => ({
    ...fields,
    categoryName,
    kind,
    mode: "fixed_quotas",
    totalQuotas,
    priceBand: bandOf(fields.priceCents),
  });
}

export function fundSuggestions(categoryName: string, kind: GiftKind) {
  return (fields: BaseFields, minAmountCents: number): GiftSuggestion => ({
    ...fields,
    categoryName,
    kind,
    mode: "free_amount",
    minAmountCents,
    priceBand: bandOf(fields.priceCents),
  });
}
