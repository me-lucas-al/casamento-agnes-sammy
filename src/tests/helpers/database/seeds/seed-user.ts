import { randomUUID } from "node:crypto";
import { users } from "@/shared/db/schema";
import type { Database } from "@/shared/db/types";

type UserOverrides = Partial<typeof users.$inferInsert>;

export async function seedUser(db: Database, overrides: UserOverrides = {}) {
  const [user] = await db
    .insert(users)
    .values({
      name: "Test User",
      email: `user-${randomUUID()}@example.com`,
      role: "couple",
      ...overrides,
    })
    .returning();
  return user;
}

export function seedAdmin(db: Database, overrides: UserOverrides = {}) {
  return seedUser(db, { name: "Test Admin", role: "admin", ...overrides });
}

export function seedCouple(db: Database, overrides: UserOverrides = {}) {
  return seedUser(db, { name: "Test Couple", role: "couple", ...overrides });
}
