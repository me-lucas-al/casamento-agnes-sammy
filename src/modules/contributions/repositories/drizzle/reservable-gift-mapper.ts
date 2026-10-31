import type { gifts } from "@/shared/db/schema";
import { resolveGiftImageUrl } from "@/modules/gifts/lib/images/resolve-gift-image-url";
import type { ReservableGift } from "@/modules/contributions/types";

export function toReservableGift(row: typeof gifts.$inferSelect): ReservableGift {
  return {
    id: row.id,
    name: row.name,
    description: row.description,
    imageUrl: resolveGiftImageUrl(row),
    productUrl: row.productUrl,
    storeName: row.storeName,
    priceCents: row.priceCents,
    mode: row.mode,
    totalQuotas: row.totalQuotas,
    minAmountCents: row.minAmountCents,
    isVisible: row.isVisible,
  };
}
