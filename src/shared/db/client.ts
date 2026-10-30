import { Pool, neonConfig } from "@neondatabase/serverless";
import { drizzle } from "drizzle-orm/neon-serverless";
import ws from "ws";
import { serverEnv } from "@/shared/config/env";
import * as schema from "./schema";
import type { Database } from "./types";

neonConfig.webSocketConstructor = ws;

let cachedDatabase: Database | undefined;

export function getDatabase(): Database {
  if (cachedDatabase) return cachedDatabase;
  const pool = new Pool({ connectionString: serverEnv.DATABASE_URL });
  cachedDatabase = drizzle(pool, { schema });
  return cachedDatabase;
}
