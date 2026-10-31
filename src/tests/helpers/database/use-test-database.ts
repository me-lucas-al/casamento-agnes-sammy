import { afterAll, afterEach, beforeAll } from "vitest";
import type { Database } from "@/shared/db/types";
import { resetDatabase } from "./reset-database";
import { createTestDatabase, type TestDatabase } from "./test-database";

export function useTestDatabase(): { readonly db: Database } {
  let testDatabase: TestDatabase | undefined;

  beforeAll(async () => {
    testDatabase = await createTestDatabase();
  });

  afterEach(async () => {
    if (testDatabase) await resetDatabase(testDatabase.db);
  });

  afterAll(async () => {
    await testDatabase?.close();
  });

  return {
    get db() {
      if (!testDatabase) throw new Error("Test database is not ready");
      return testDatabase.db;
    },
  };
}
