import { eq } from "drizzle-orm";
import { guests, rsvpCompanions, rsvps, users } from "@/shared/db/schema";
import type { Database } from "@/shared/db/types";
import { saveOwnProfile } from "./drizzle-own-profile-save";
import type { ProfileRepository } from "./profile-repository";

export function createDrizzleProfileRepository(database: Database): ProfileRepository {
  return {
    async findGuestProfile(guestId) {
      const [row] = await database
        .select({
          guestId: guests.id,
          name: guests.name,
          phone: guests.phone,
          email: guests.email,
          profileCompletedAt: guests.profileCompletedAt,
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
      const relatives = await database
        .select({ name: rsvpCompanions.name, dietaryNote: rsvpCompanions.dietaryNote })
        .from(rsvpCompanions)
        .where(eq(rsvpCompanions.guestId, guestId));
      const { profileCompletedAt, ...profile } = row;
      return {
        ...profile,
        rsvpStatus: row.rsvpStatus ?? "pending",
        relatives,
        profileCompleted: profileCompletedAt !== null,
      };
    },
    saveOwnProfile: (changes) => saveOwnProfile(database, changes),
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
