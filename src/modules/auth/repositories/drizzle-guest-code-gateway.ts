import { eq } from "drizzle-orm";
import { guests } from "@/shared/db/schema";
import type { Database } from "@/shared/db/types";
import type { GuestCodeGateway } from "./guest-code-gateway";

export function createDrizzleGuestCodeGateway(database: Database): GuestCodeGateway {
  return {
    async findByCode(code) {
      const [guest] = await database
        .select({ id: guests.id, name: guests.name })
        .from(guests)
        .where(eq(guests.code, code))
        .limit(1);
      return guest ?? null;
    },
    async markAccess(guestId, accessedAt) {
      await database.update(guests).set({ lastAccessAt: accessedAt }).where(eq(guests.id, guestId));
    },
  };
}
