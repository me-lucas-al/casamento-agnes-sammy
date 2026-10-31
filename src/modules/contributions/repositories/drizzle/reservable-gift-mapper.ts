import type { gifts } from "@/shared/db/schema";
import type { ReservableGift } from "@/modules/contributions/types";

export function toReservableGift(row: typeof gifts.$inferSelect): ReservableGift {
  return {
    id: row.id,
    name: row.name,
    description: row.description,
    imageUrl: row.imageUrl,
    priceCents: row.priceCents,
    mode: row.mode,
    totalQuotas: row.totalQuotas,
    minAmountCents: row.minAmountCents,
    isVisible: row.isVisible,
  };
}
