import { and, asc, count, desc, eq, ilike, or, sql } from "drizzle-orm";
import { giftContributions, guests, rsvps } from "@/shared/db/schema";
import type { Database } from "@/shared/db/types";
import { containsPattern } from "@/shared/lib/sql-like";
import type { GuestSort } from "@/modules/guests/types";
import { deleteGuestUnlessCommitted } from "./drizzle-guest-deletion";
import type { GuestRepository } from "../contracts/guest-repository";

function buildSearchFilter(search: string) {
  if (!search) return undefined;
  const pattern = containsPattern(search);
  return or(ilike(guests.name, pattern), ilike(guests.code, pattern), ilike(guests.phone, pattern));
}

function buildOrder(sort: GuestSort) {
  if (sort === "name") return [asc(guests.name), asc(guests.id)];
  if (sort === "access") return [sql`${guests.lastAccessAt} desc nulls last`, asc(guests.id)];
  return [desc(guests.createdAt), asc(guests.id)];
}

export function createDrizzleGuestRepository(database: Database): GuestRepository {
  return {
    async findById(guestId) {
      const [guest] = await database.select().from(guests).where(eq(guests.id, guestId)).limit(1);
      return guest ?? null;
    },
    async codeExists(code) {
      const [row] = await database.select({ id: guests.id }).from(guests).where(eq(guests.code, code)).limit(1);
      return Boolean(row);
    },
    async create(newGuest) {
      const [guest] = await database.insert(guests).values(newGuest).returning();
      return guest;
    },
    async update(guestId, details) {
      const [guest] = await database.update(guests).set(details).where(eq(guests.id, guestId)).returning();
      return guest ?? null;
    },
    async updateCode(guestId, code) {
      const [guest] = await database.update(guests).set({ code }).where(eq(guests.id, guestId)).returning();
      return guest ?? null;
    },
    async hasConfirmedContributions(guestId) {
      const [row] = await database
        .select({ id: giftContributions.id })
        .from(giftContributions)
        .where(and(eq(giftContributions.guestId, guestId), eq(giftContributions.status, "confirmed")))
        .limit(1);
      return Boolean(row);
    },
    deleteUnlessCommitted: (guestId) => deleteGuestUnlessCommitted(database, guestId),
    async listPage({ limit, offset, search, sort }) {
      const filter = buildSearchFilter(search);
      const [rows, [totalRow]] = await Promise.all([
        database
          .select({ guest: guests, rsvpStatus: rsvps.status })
          .from(guests)
          .leftJoin(rsvps, eq(rsvps.guestId, guests.id))
          .where(filter)
          .orderBy(...buildOrder(sort))
          .limit(limit)
          .offset(offset),
        database.select({ total: count() }).from(guests).where(filter),
      ]);
      const items = rows.map(({ guest, rsvpStatus }) => ({ ...guest, rsvpStatus: rsvpStatus ?? "pending" }));
      return { items, total: totalRow?.total ?? 0 };
    },
  };
}
