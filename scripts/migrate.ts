import { migrate } from "drizzle-orm/node-postgres/migrator";
import { migrate as migrateNeon } from "drizzle-orm/neon-serverless/migrator";
import { drizzle } from "drizzle-orm/node-postgres";
import { Pool } from "pg";
import { isLocalDatabaseUrl } from "@/shared/db/connection";

const migrationsFolder = "src/shared/db/migrations";

async function migrateLocal(connectionString: string) {
  const pool = new Pool({ connectionString });
  await migrate(drizzle(pool), { migrationsFolder });
  await pool.end();
}

async function migrateRemote(connectionString: string) {
  const { Pool: NeonPool, neonConfig } = await import("@neondatabase/serverless");
  const { drizzle: drizzleNeon } = await import("drizzle-orm/neon-serverless");
  const { default: ws } = await import("ws");
  neonConfig.webSocketConstructor = ws;
  const pool = new NeonPool({ connectionString });
  await migrateNeon(drizzleNeon(pool), { migrationsFolder });
  await pool.end();
}

async function main() {
  const connectionString = process.env.DATABASE_URL;
  if (!connectionString) throw new Error("DATABASE_URL is required");
  if (isLocalDatabaseUrl(connectionString)) return migrateLocal(connectionString);
  return migrateRemote(connectionString);
}

main()
  .then(() => console.log("Migrations applied"))
  .catch((error) => {
    console.error(error);
    process.exit(1);
  });
