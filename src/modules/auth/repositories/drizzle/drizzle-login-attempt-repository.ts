import { and, count, eq, gte, lt } from "drizzle-orm";
import { loginAttempts } from "@/shared/db/schema";
import type { Database } from "@/shared/db/types";
import type { LoginAttemptRepository } from "../contracts/login-attempt-repository";

export function createDrizzleLoginAttemptRepository(database: Database): LoginAttemptRepository {
  return {
    async countSince(ipHash, since) {
      const [row] = await database
        .select({ total: count() })
        .from(loginAttempts)
        .where(and(eq(loginAttempts.ipHash, ipHash), gte(loginAttempts.at, since)));
      return row?.total ?? 0;
    },
    async record(ipHash, at) {
      await database.insert(loginAttempts).values({ ipHash, at });
    },
    async clearForIp(ipHash) {
      await database.delete(loginAttempts).where(eq(loginAttempts.ipHash, ipHash));
    },
    async deleteOlderThan(threshold) {
      const removed = await database
        .delete(loginAttempts)
        .where(lt(loginAttempts.at, threshold))
        .returning({ id: loginAttempts.id });
      return removed.length;
    },
  };
}
