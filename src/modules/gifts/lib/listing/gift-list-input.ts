import type { PageParams } from "@/shared/lib/pagination";
import type { GiftSortOption } from "./gift-sort";
import type { PriceBand } from "../pricing/price-band";

export type GiftListFilters = {
  search: string;
  categoryId?: string;
  sort: GiftSortOption;
  band?: PriceBand;
};

export type GiftListInput = PageParams & GiftListFilters;

export function buildGiftCacheKeyParts(input: GiftListInput): string[] {
  return [
    "gifts-visible-page",
    `page:${input.page}`,
    `perPage:${input.perPage}`,
    `search:${input.search}`,
    `category:${input.categoryId ?? ""}`,
    `sort:${input.sort}`,
    `band:${input.band?.id ?? ""}`,
  ];
}
