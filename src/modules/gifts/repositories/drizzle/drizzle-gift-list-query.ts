import { and, asc, desc, eq, gt, ilike, lte, or, type SQL } from "drizzle-orm";
import { gifts } from "@/shared/db/schema";
import { containsPattern } from "@/shared/lib/sql-like";
import type { GiftSortOption } from "@/modules/gifts/lib/listing/gift-sort";
import type { PriceBand } from "@/modules/gifts/lib/pricing/price-band";
import type { GiftListQuery } from "../contracts/gift-repository";

function buildBandFilter(band: PriceBand | undefined): SQL[] {
  if (!band) return [];
  const filters: SQL[] = [];
  if (band.minCentsExclusive !== null) filters.push(gt(gifts.priceCents, band.minCentsExclusive));
  if (band.maxCentsInclusive !== null) filters.push(lte(gifts.priceCents, band.maxCentsInclusive));
  return filters;
}

function buildSearchFilter(search: string): SQL[] {
  if (!search) return [];
  const pattern = containsPattern(search);
  const matches = or(ilike(gifts.name, pattern), ilike(gifts.description, pattern));
  return matches ? [matches] : [];
}

export function buildGiftFilters(query: GiftListQuery): SQL | undefined {
  const visibility = query.onlyVisible ? [eq(gifts.isVisible, true)] : [];
  const category = query.categoryId ? [eq(gifts.categoryId, query.categoryId)] : [];
  return and(...visibility, ...category, ...buildSearchFilter(query.search), ...buildBandFilter(query.band));
}

const ORDER_BY_SORT: Record<GiftSortOption, SQL[]> = {
  order: [asc(gifts.sortOrder), asc(gifts.name)],
  "price-asc": [asc(gifts.priceCents), asc(gifts.name)],
  "price-desc": [desc(gifts.priceCents), asc(gifts.name)],
  name: [asc(gifts.name)],
  newest: [desc(gifts.createdAt)],
};

export function buildGiftOrder(sort: GiftSortOption): SQL[] {
  return [...ORDER_BY_SORT[sort], asc(gifts.id)];
}
