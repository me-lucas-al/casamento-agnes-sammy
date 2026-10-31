import type { PriceBandId } from "@/modules/gifts/lib/pricing/price-band";
import type { GiftKind, GiftMode } from "@/modules/gifts/types";
import type { SuggestionCategoryKey } from "./data/category-names";
import type { ProductTypeId } from "./data/product-types";
import type { StoreId } from "./data/stores";

export type GiftSuggestion = {
  id: string;
  categoryKey: SuggestionCategoryKey;
  categoryName: string;
  name: string;
  description: string;
  kind: GiftKind;
  mode: GiftMode;
  type: ProductTypeId;
  priceCents: number;
  totalQuotas?: number;
  minAmountCents?: number;
  priceBand: PriceBandId;
  store: StoreId | null;
  storeSearchUrl: string | null;
  tags: string[];
};

export type SuggestionWithStatus = GiftSuggestion & { alreadyInList: boolean };

export type AddSuggestionsResult = {
  createdCount: number;
  skippedIds: string[];
  failedIds: string[];
};
