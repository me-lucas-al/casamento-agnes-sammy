import { Pool as NeonPool, neonConfig } from "@neondatabase/serverless";
import { drizzle as drizzleNeon } from "drizzle-orm/neon-serverless";
import { drizzle as drizzleNodePostgres } from "drizzle-orm/node-postgres";
import { Pool as NodePostgresPool } from "pg";
import ws from "ws";
import { POOL_OPTIONS } from "./pool-options";
import * as schema from "./schema";
import type { Database } from "./types";

const LOCAL_HOSTNAMES = new Set(["localhost", "127.0.0.1", "::1", "postgres"]);

export type DatabaseConnection = {
  database: Database;
  close: () => Promise<void>;
};

export function isLocalDatabaseUrl(connectionString: string): boolean {
  return LOCAL_HOSTNAMES.has(new URL(connectionString).hostname);
}

function connectToLocalPostgres(connectionString: string): DatabaseConnection {
  const pool = new NodePostgresPool({ connectionString, ...POOL_OPTIONS });
  return { database: drizzleNodePostgres(pool, { schema }), close: () => pool.end() };
}

function connectToNeon(connectionString: string): DatabaseConnection {
  neonConfig.webSocketConstructor = ws;
  const pool = new NeonPool({ connectionString, ...POOL_OPTIONS });
  return { database: drizzleNeon(pool, { schema }), close: () => pool.end() };
}

export function connectToDatabase(connectionString: string): DatabaseConnection {
  if (isLocalDatabaseUrl(connectionString)) return connectToLocalPostgres(connectionString);
  return connectToNeon(connectionString);
}
