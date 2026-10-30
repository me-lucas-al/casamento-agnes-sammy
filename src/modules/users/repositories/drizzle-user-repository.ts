import { and, count, desc, eq, ilike, or } from "drizzle-orm";
import { users } from "@/shared/db/schema";
import type { Database } from "@/shared/db/types";
import type { UserRepository } from "./user-repository";

function buildSearchFilter(search: string) {
  if (!search) return undefined;
  const pattern = `%${search}%`;
  return or(ilike(users.name, pattern), ilike(users.email, pattern));
}

export function createDrizzleUserRepository(database: Database): UserRepository {
  return {
    async findById(userId) {
      const [user] = await database.select().from(users).where(eq(users.id, userId)).limit(1);
      return user ?? null;
    },
    async findByEmail(email) {
      const [user] = await database.select().from(users).where(eq(users.email, email)).limit(1);
      return user ?? null;
    },
    async findActiveByEmail(email) {
      const [user] = await database
        .select()
        .from(users)
        .where(and(eq(users.email, email), eq(users.isActive, true)))
        .limit(1);
      return user ?? null;
    },
    async create(newUser) {
      const [user] = await database.insert(users).values(newUser).returning();
      return user;
    },
    async listPage({ limit, offset, search }) {
      const filter = buildSearchFilter(search);
      const [items, [totalRow]] = await Promise.all([
        database.select().from(users).where(filter).orderBy(desc(users.createdAt)).limit(limit).offset(offset),
        database.select({ total: count() }).from(users).where(filter),
      ]);
      return { items, total: totalRow?.total ?? 0 };
    },
  };
}
