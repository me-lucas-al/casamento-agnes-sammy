import { and, count, desc, eq, ilike, isNull, or, sql } from "drizzle-orm";
import { guests, rsvpCompanions, rsvps } from "@/shared/db/schema";
import type { Database } from "@/shared/db/types";
import { containsPattern } from "@/shared/lib/sql-like";
import type { RsvpListPage, RsvpListQuery, RsvpStatus, RsvpTotals } from "@/modules/rsvp/types";

function buildStatusFilter(status: RsvpStatus | undefined) {
  if (!status) return undefined;
  if (status === "pending") return or(isNull(rsvps.status), eq(rsvps.status, "pending"));
  return eq(rsvps.status, status);
}

function buildFilter({ status, search }: Pick<RsvpListQuery, "status" | "search">) {
  const searchFilter = search ? ilike(guests.name, containsPattern(search)) : undefined;
  return and(buildStatusFilter(status), searchFilter);
}

export async function listRsvpPage(database: Database, query: RsvpListQuery): Promise<RsvpListPage> {
  const filter = buildFilter(query);
  const companionsCount = sql<number>`(select count(*)::int from ${rsvpCompanions} where ${rsvpCompanions.guestId} = ${guests.id})`;
  const baseQuery = (selection: Parameters<Database["select"]>[0]) =>
    database.select(selection as never).from(guests).leftJoin(rsvps, eq(rsvps.guestId, guests.id)).where(filter);
  const [rows, [totalRow]] = await Promise.all([
    database
      .select({
        guestId: guests.id,
        guestName: guests.name,
        seats: guests.seats,
        status: sql<RsvpStatus>`coalesce(${rsvps.status}, 'pending')`,
        respondedAt: rsvps.respondedAt,
        companionsCount,
      })
      .from(guests)
      .leftJoin(rsvps, eq(rsvps.guestId, guests.id))
      .where(filter)
      .orderBy(desc(rsvps.respondedAt), guests.name)
      .limit(query.limit)
      .offset(query.offset),
    database
      .select({ total: count() })
      .from(guests)
      .leftJoin(rsvps, eq(rsvps.guestId, guests.id))
      .where(filter),
  ]);
  void baseQuery;
  return { items: rows, total: totalRow?.total ?? 0 };
}

export async function calculateRsvpTotals(database: Database): Promise<RsvpTotals> {
  const [[guestRow], statusRows, [companionRow]] = await Promise.all([
    database.select({ total: count() }).from(guests),
    database.select({ status: rsvps.status, total: count() }).from(rsvps).groupBy(rsvps.status),
    database
      .select({ total: count() })
      .from(rsvpCompanions)
      .innerJoin(rsvps, eq(rsvps.guestId, rsvpCompanions.guestId))
      .where(eq(rsvps.status, "going")),
  ]);
  const totalFor = (status: RsvpStatus) => statusRows.find((row) => row.status === status)?.total ?? 0;
  const going = totalFor("going");
  const declined = totalFor("declined");
  return {
    going,
    declined,
    pending: Math.max((guestRow?.total ?? 0) - going - declined, 0),
    attendingPeople: going + (companionRow?.total ?? 0),
  };
}
