import { getTableName, is, sql } from "drizzle-orm";
import { PgTable } from "drizzle-orm/pg-core";
import * as schema from "@/shared/db/schema";
import type { Database } from "@/shared/db/types";

const tableNames = Object.values<unknown>(schema)
  .filter((exported): exported is PgTable => is(exported, PgTable))
  .map((table) => `"${getTableName(table)}"`);

export async function resetDatabase(db: Database): Promise<void> {
  await db.execute(sql.raw(`TRUNCATE ${tableNames.join(", ")} RESTART IDENTITY CASCADE`));
}
