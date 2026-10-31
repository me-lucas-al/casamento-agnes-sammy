import { eq } from "drizzle-orm";
import { users } from "@/shared/db/schema";
import type { Database } from "@/shared/db/types";
import type { TourRepository } from "../contracts/tour-repository";

export function createDrizzleTourRepository(database: Database): TourRepository {
  return {
    async findCompletedAt(userId) {
      const [row] = await database
        .select({ completedAt: users.tourCompletedAt })
        .from(users)
        .where(eq(users.id, userId))
        .limit(1);
      return row ?? null;
    },
    async saveCompletedAt(userId, completedAt) {
      const updatedRows = await database
        .update(users)
        .set({ tourCompletedAt: completedAt })
        .where(eq(users.id, userId))
        .returning({ id: users.id });
      return updatedRows.length > 0;
    },
  };
}
