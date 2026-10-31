import type { GiftWithCategory, PublicGift } from "@/modules/gifts/types";
import { resolveGiftImageUrl } from "../images/resolve-gift-image-url";

export function toPublicGift(gift: GiftWithCategory): PublicGift {
  return {
    id: gift.id,
    name: gift.name,
    description: gift.description,
    imageUrl: resolveGiftImageUrl(gift),
    productUrl: gift.productUrl,
    storeName: gift.storeName,
    priceCents: gift.priceCents,
    mode: gift.mode,
    totalQuotas: gift.totalQuotas,
    minAmountCents: gift.minAmountCents,
  };
}
