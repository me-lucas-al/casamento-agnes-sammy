import { eq } from "drizzle-orm";
import { guests, rsvpCompanions } from "@/shared/db/schema";
import type { Database } from "@/shared/db/types";
import type { OwnProfileSave } from "../types";

export async function saveOwnProfile(
  database: Database,
  { guestId, name, phone, email, relatives, completedAt }: OwnProfileSave,
): Promise<void> {
  await database.transaction(async (transaction) => {
    await transaction
      .update(guests)
      .set({ name, phone, email, profileCompletedAt: completedAt })
      .where(eq(guests.id, guestId));
    await transaction.delete(rsvpCompanions).where(eq(rsvpCompanions.guestId, guestId));
    if (relatives.length === 0) return;
    await transaction.insert(rsvpCompanions).values(relatives.map((relative) => ({ guestId, ...relative })));
  });
}
