import { z } from "zod";
import { parseBrlToCents } from "@/shared/lib/money/money";
import { firstValue, type SearchParams } from "./url-params";

const MAX_PRICE_CENTS = 100_000_000;

const priceSchema = z.number().int().min(0).max(MAX_PRICE_CENTS).optional().catch(undefined);

export type PriceRange = {
  minPriceCents?: number;
  maxPriceCents?: number;
};

function parsePriceCents(rawValue: string | string[] | undefined): number | undefined {
  const text = firstValue(rawValue)?.trim();
  if (!text) return undefined;
  return priceSchema.parse(parseBrlToCents(text) ?? undefined);
}

export function parsePriceRangeParams(searchParams: SearchParams): PriceRange {
  const minCents = parsePriceCents(searchParams.precoMin);
  const maxCents = parsePriceCents(searchParams.precoMax);
  if (minCents !== undefined && maxCents !== undefined && minCents > maxCents) {
    return { minPriceCents: maxCents, maxPriceCents: minCents };
  }
  return { minPriceCents: minCents, maxPriceCents: maxCents };
}
