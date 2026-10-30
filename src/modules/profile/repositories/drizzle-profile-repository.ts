import { eq } from "drizzle-orm";
import { guests, rsvps, users } from "@/shared/db/schema";
import type { Database } from "@/shared/db/types";
import type { ProfileRepository } from "./profile-repository";

export function createDrizzleProfileRepository(database: Database): ProfileRepository {
  return {
    async findGuestProfile(guestId) {
      const [row] = await database
        .select({
          guestId: guests.id,
          name: guests.name,
          phone: guests.phone,
          seats: guests.seats,
          code: guests.code,
          rsvpStatus: rsvps.status,
          respondedAt: rsvps.respondedAt,
        })
        .from(guests)
        .leftJoin(rsvps, eq(rsvps.guestId, guests.id))
        .where(eq(guests.id, guestId))
        .limit(1);
      if (!row) return null;
      return { ...row, rsvpStatus: row.rsvpStatus ?? "pending" };
    },
    async findStaffProfile(userId) {
      const [row] = await database
        .select({ userId: users.id, name: users.name, email: users.email, role: users.role, image: users.image })
        .from(users)
        .where(eq(users.id, userId))
        .limit(1);
      return row ?? null;
    },
  };
}
