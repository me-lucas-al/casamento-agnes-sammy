import type { Gift, GiftDraft } from "../types";

export function hasGiftPricingChanged(existingGift: Gift, draft: GiftDraft): boolean {
  return (
    existingGift.mode !== draft.mode ||
    existingGift.priceCents !== draft.priceCents ||
    (existingGift.totalQuotas ?? null) !== draft.totalQuotas ||
    (existingGift.minAmountCents ?? null) !== draft.minAmountCents
  );
}
