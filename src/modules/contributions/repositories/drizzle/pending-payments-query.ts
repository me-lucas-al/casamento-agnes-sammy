import { and, asc, count, desc, eq, ilike, or } from "drizzle-orm";
import { giftContributions, gifts, guests } from "@/shared/db/schema";
import type { Database } from "@/shared/db/types";
import { containsPattern } from "@/shared/lib/sql/sql-like";
import type { PaymentSort, PendingPaymentsPage, PendingPaymentsQuery } from "@/modules/contributions/types";

function buildFilter({ status, search }: PendingPaymentsQuery) {
  const statusFilter = status === "all" ? undefined : eq(giftContributions.status, status);
  const pattern = containsPattern(search);
  const searchFilter = search
    ? or(ilike(guests.name, pattern), ilike(gifts.name, pattern))
    : undefined;
  return and(statusFilter, searchFilter);
}

function buildOrder(sort: PaymentSort) {
  if (sort === "oldest") return asc(giftContributions.createdAt);
  if (sort === "amount") return desc(giftContributions.amountCents);
  if (sort === "expires") return asc(giftContributions.expiresAt);
  return desc(giftContributions.createdAt);
}

export async function queryPendingPaymentsPage(
  database: Database,
  query: PendingPaymentsQuery,
): Promise<PendingPaymentsPage> {
  const filter = buildFilter(query);
  const joined = () =>
    database
      .select({
        contribution: giftContributions,
        giftName: gifts.name,
        guestName: guests.name,
      })
      .from(giftContributions)
      .innerJoin(gifts, eq(gifts.id, giftContributions.giftId))
      .innerJoin(guests, eq(guests.id, giftContributions.guestId));
  const [rows, [totalRow]] = await Promise.all([
    joined().where(filter).orderBy(buildOrder(query.sort)).limit(query.limit).offset(query.offset),
    database
      .select({ total: count() })
      .from(giftContributions)
      .innerJoin(gifts, eq(gifts.id, giftContributions.giftId))
      .innerJoin(guests, eq(guests.id, giftContributions.guestId))
      .where(filter),
  ]);
  const items = rows.map(({ contribution, giftName, guestName }) => ({
    ...contribution,
    giftName,
    guestName,
  }));
  return { items, total: totalRow?.total ?? 0 };
}
