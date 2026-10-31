import type { GiftKind, GiftMode } from "@/modules/gifts/types";
import type { PriceBandId } from "@/modules/gifts/lib/price-band";

export type GiftSuggestion = {
  id: string;
  categoryName: string;
  name: string;
  description: string;
  kind: GiftKind;
  mode: GiftMode;
  priceCents: number;
  totalQuotas?: number;
  minAmountCents?: number;
  priceBand: PriceBandId;
};

export type SuggestionWithStatus = GiftSuggestion & { alreadyInList: boolean };

export type SuggestionGroup<Suggestion extends GiftSuggestion = GiftSuggestion> = {
  categoryName: string;
  suggestions: Suggestion[];
};

export type AddSuggestionsResult = {
  createdCount: number;
  skippedIds: string[];
};
