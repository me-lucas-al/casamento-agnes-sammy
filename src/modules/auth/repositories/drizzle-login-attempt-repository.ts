import { and, count, eq, gte } from "drizzle-orm";
import { loginAttempts } from "@/shared/db/schema";
import type { Database } from "@/shared/db/types";
import type { LoginAttemptRepository } from "./login-attempt-repository";

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
  };
}
