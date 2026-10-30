import { getServerEnv } from "@/shared/config/env";
import { connectToDatabase } from "./connection";
import type { Database } from "./types";

let cachedDatabase: Database | undefined;

export function getDatabase(): Database {
  cachedDatabase ??= connectToDatabase(getServerEnv().DATABASE_URL).database;
  return cachedDatabase;
}
