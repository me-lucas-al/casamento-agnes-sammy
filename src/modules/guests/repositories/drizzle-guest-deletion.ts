import { eq } from "drizzle-orm";
import { giftContributions, guests, photos } from "@/shared/db/schema";
import type { Database } from "@/shared/db/types";
import type { GuestDeletionOutcome } from "./guest-repository";

export function deleteGuestUnlessCommitted(
  database: Database,
  guestId: string,
): Promise<GuestDeletionOutcome> {
  return database.transaction(async (transaction) => {
    const [guest] = await transaction
      .select({ id: guests.id })
      .from(guests)
      .where(eq(guests.id, guestId))
      .limit(1)
      .for("update");
    if (!guest) return "not_found";
    const contributions = await transaction
      .select({ status: giftContributions.status })
      .from(giftContributions)
      .where(eq(giftContributions.guestId, guestId))
      .for("update");
    if (contributions.some(({ status }) => status === "confirmed")) return "has_confirmed";
    await transaction.update(photos).set({ uploadedByGuestId: null }).where(eq(photos.uploadedByGuestId, guestId));
    await transaction.delete(giftContributions).where(eq(giftContributions.guestId, guestId));
    await transaction.delete(guests).where(eq(guests.id, guestId));
    return "deleted";
  });
}
