import { and, eq } from "drizzle-orm";
import { guests, users } from "@/shared/db/schema";
import type { Database } from "@/shared/db/types";
import type { SessionAccountLookup } from "../contracts/session-account-lookup";

export function createDrizzleSessionAccountLookup(database: Database): SessionAccountLookup {
  return {
    async findActiveStaffRole(userId) {
      const [user] = await database
        .select({ role: users.role })
        .from(users)
        .where(and(eq(users.id, userId), eq(users.isActive, true)))
        .limit(1);
      return user?.role ?? null;
    },
    async guestExists(guestId) {
      const [guest] = await database.select({ id: guests.id }).from(guests).where(eq(guests.id, guestId)).limit(1);
      return Boolean(guest);
    },
  };
}
