import { eq } from "drizzle-orm";
import { eventSettings, guests, rsvpCompanions, rsvps } from "@/shared/db/schema";
import type { Database } from "@/shared/db/types";
import { calculateRsvpTotals, listRsvpPage } from "./drizzle-rsvp-list";
import type { RsvpRepository } from "../contracts/rsvp-repository";

export function createDrizzleRsvpRepository(database: Database): RsvpRepository {
  return {
    async findGuestRsvp(guestId) {
      const [guest] = await database.select().from(guests).where(eq(guests.id, guestId)).limit(1);
      if (!guest) return null;
      const [rsvp] = await database.select().from(rsvps).where(eq(rsvps.guestId, guestId)).limit(1);
      const companions = await database
        .select({ name: rsvpCompanions.name, dietaryNote: rsvpCompanions.dietaryNote })
        .from(rsvpCompanions)
        .where(eq(rsvpCompanions.guestId, guestId));
      return {
        guestId,
        guestName: guest.name,
        seats: guest.seats,
        status: rsvp?.status ?? "pending",
        dietaryNote: rsvp?.dietaryNote ?? null,
        respondedAt: rsvp?.respondedAt ?? null,
        companions,
      };
    },
    async findDeadline() {
      const [settings] = await database
        .select({ rsvpDeadline: eventSettings.rsvpDeadline })
        .from(eventSettings)
        .limit(1);
      return settings?.rsvpDeadline ?? null;
    },
    async save({ guestId, status, dietaryNote, companions, respondedAt }) {
      await database.transaction(async (transaction) => {
        await transaction
          .insert(rsvps)
          .values({ guestId, status, dietaryNote, respondedAt })
          .onConflictDoUpdate({ target: rsvps.guestId, set: { status, dietaryNote, respondedAt } });
        await transaction.delete(rsvpCompanions).where(eq(rsvpCompanions.guestId, guestId));
        if (companions.length === 0) return;
        await transaction
          .insert(rsvpCompanions)
          .values(companions.map((companion) => ({ guestId, ...companion })));
      });
    },
    async remove(guestId) {
      await database.transaction(async (transaction) => {
        await transaction.delete(rsvps).where(eq(rsvps.guestId, guestId));
        await transaction.delete(rsvpCompanions).where(eq(rsvpCompanions.guestId, guestId));
      });
    },
    listPage: (query) => listRsvpPage(database, query),
    calculateTotals: () => calculateRsvpTotals(database),
  };
}
