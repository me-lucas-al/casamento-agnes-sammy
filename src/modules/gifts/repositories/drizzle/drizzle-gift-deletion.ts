import { eq } from "drizzle-orm";
import { giftContributions, gifts } from "@/shared/db/schema";
import type { Database } from "@/shared/db/types";
import type { GiftDeletionOutcome } from "../contracts/gift-repository";

export function deleteGiftUnlessCommitted(
  database: Database,
  giftId: string,
  now: Date,
): Promise<GiftDeletionOutcome> {
  return database.transaction(async (transaction) => {
    const [gift] = await transaction
      .select()
      .from(gifts)
      .where(eq(gifts.id, giftId))
      .limit(1)
      .for("update");
    if (!gift) return { status: "not_found" };
    const contributions = await transaction
      .select({ status: giftContributions.status, expiresAt: giftContributions.expiresAt })
      .from(giftContributions)
      .where(eq(giftContributions.giftId, giftId))
      .for("update");
    if (contributions.some(({ status }) => status === "confirmed")) {
      return { status: "has_confirmed" };
    }
    const hasActiveReservation = contributions.some(
      ({ status, expiresAt }) => status === "reserved" && expiresAt > now,
    );
    if (hasActiveReservation) return { status: "has_active_reservations" };
    await transaction.delete(giftContributions).where(eq(giftContributions.giftId, giftId));
    await transaction.delete(gifts).where(eq(gifts.id, giftId));
    return { status: "deleted", gift };
  });
}
