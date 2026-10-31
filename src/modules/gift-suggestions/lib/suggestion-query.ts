import type { PriceBandId } from "@/modules/gifts/lib/price-band";
import type { GiftMode } from "@/modules/gifts/types";
import type { PageParams } from "@/shared/lib/pagination";
import type { SuggestionCategoryKey } from "../data/category-names";
import type { ProductTypeId } from "../data/product-types";
import type { StoreId } from "../data/stores";

export const SUGGESTION_SORTS = ["relevancia", "menor-preco", "maior-preco", "a-z"] as const;

export type SuggestionSort = (typeof SUGGESTION_SORTS)[number];

export const SUGGESTION_MODE_PARAMS = { item: "single", cotas: "fixed_quotas", livre: "free_amount" } as const;

export type SuggestionModeParam = keyof typeof SUGGESTION_MODE_PARAMS;

export type SuggestionFilters = {
  q: string;
  stores: StoreId[];
  category?: SuggestionCategoryKey;
  type?: ProductTypeId;
  minPriceCents?: number;
  maxPriceCents?: number;
  band?: PriceBandId;
  mode?: GiftMode;
  sort: SuggestionSort;
};

export type SuggestionQuery = SuggestionFilters & PageParams;
