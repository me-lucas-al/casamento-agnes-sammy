import type { GiftInput } from "@/modules/gifts/types";
import type { GiftSuggestion } from "@/modules/gift-suggestions/types";

export function buildGiftInputFromSuggestion(suggestion: GiftSuggestion, categoryId: string): GiftInput {
  return {
    categoryId,
    kind: suggestion.kind,
    name: suggestion.name,
    description: suggestion.description,
    priceCents: suggestion.priceCents,
    mode: suggestion.mode,
    totalQuotas: suggestion.totalQuotas ?? null,
    minAmountCents: suggestion.minAmountCents ?? null,
    isVisible: true,
    sortOrder: 0,
    productUrl: suggestion.productUrl,
    externalImageUrl: suggestion.imageUrl,
    storeName: suggestion.storeName,
    priceCheckedAt: suggestion.priceCheckedAt,
  };
}
