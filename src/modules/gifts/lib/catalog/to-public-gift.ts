import type { GiftWithCategory, PublicGift } from "@/modules/gifts/types";

export function toPublicGift(gift: GiftWithCategory): PublicGift {
  return {
    id: gift.id,
    categoryId: gift.categoryId,
    categoryName: gift.categoryName,
    kind: gift.kind,
    name: gift.name,
    description: gift.description,
    imageUrl: gift.imageUrl,
    priceCents: gift.priceCents,
    mode: gift.mode,
    totalQuotas: gift.totalQuotas,
    minAmountCents: gift.minAmountCents,
  };
}
