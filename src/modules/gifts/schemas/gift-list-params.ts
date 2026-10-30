import { z } from "zod";
import { parsePageParams } from "@/shared/lib/pagination";
import { enumParam, firstValue, textParam, type SearchParams } from "@/shared/lib/url-params";
import { DEFAULT_GIFT_SORT, GIFT_SORT_OPTIONS } from "../lib/gift-sort";
import type { GiftListInput } from "../lib/gift-list-input";
import { findPriceBand, PRICE_BAND_IDS } from "../lib/price-band";

const categoryIdSchema = z.uuid();

function parseCategoryId(searchParams: SearchParams): string | undefined {
  const parsed = categoryIdSchema.safeParse(firstValue(searchParams.category));
  return parsed.success ? parsed.data : undefined;
}

export function parseGiftListParams(searchParams: SearchParams): GiftListInput {
  return {
    ...parsePageParams(searchParams),
    search: textParam(searchParams, "search"),
    categoryId: parseCategoryId(searchParams),
    sort: enumParam(searchParams, "sort", GIFT_SORT_OPTIONS) ?? DEFAULT_GIFT_SORT,
    band: findPriceBand(enumParam(searchParams, "band", PRICE_BAND_IDS)),
  };
}
