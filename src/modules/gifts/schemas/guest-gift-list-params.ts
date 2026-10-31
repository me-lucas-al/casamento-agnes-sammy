import { parsePageParams } from "@/shared/lib/pagination/pagination";
import { parsePriceRangeParams } from "@/shared/lib/url/price-params";
import { enumParam, textParam, type SearchParams } from "@/shared/lib/url/url-params";
import type { GiftListInput } from "../lib/listing/gift-list-input";
import { DEFAULT_GIFT_SORT, GIFT_SORT_OPTIONS } from "../lib/listing/gift-sort";

export function parseGuestGiftListParams(searchParams: SearchParams): GiftListInput {
  return {
    ...parsePageParams(searchParams),
    search: textParam(searchParams, "q"),
    sort: enumParam(searchParams, "sort", GIFT_SORT_OPTIONS) ?? DEFAULT_GIFT_SORT,
    ...parsePriceRangeParams(searchParams),
  };
}
