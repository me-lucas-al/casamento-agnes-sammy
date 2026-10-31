import { and, eq, gt, inArray, or, sql } from "drizzle-orm";
import { giftContributions } from "@/shared/db/schema";
import type { Database } from "@/shared/db/types";
import type { ContributionTotals } from "@/modules/gifts/lib/availability/gift-availability";

export async function sumActiveContributions(
  database: Database,
  giftIds: string[],
  now: Date,
): Promise<Map<string, ContributionTotals>> {
  if (giftIds.length === 0) return new Map();
  const isActive = or(
    eq(giftContributions.status, "confirmed"),
    and(eq(giftContributions.status, "reserved"), gt(giftContributions.expiresAt, now)),
  );
  const rows = await database
    .select({
      giftId: giftContributions.giftId,
      quotas: sql<number>`coalesce(sum(${giftContributions.quotas}), 0)::int`,
      amountCents: sql<number>`coalesce(sum(${giftContributions.amountCents}), 0)::int`,
      count: sql<number>`count(*)::int`,
    })
    .from(giftContributions)
    .where(and(inArray(giftContributions.giftId, giftIds), isActive))
    .groupBy(giftContributions.giftId);
  return new Map(
    rows.map(({ giftId, ...totals }) => [giftId, totals] satisfies [string, ContributionTotals]),
  );
}

export async function hasConfirmedContribution(database: Database, giftId: string): Promise<boolean> {
  const [row] = await database
    .select({ id: giftContributions.id })
    .from(giftContributions)
    .where(and(eq(giftContributions.giftId, giftId), eq(giftContributions.status, "confirmed")))
    .limit(1);
  return Boolean(row);
}
