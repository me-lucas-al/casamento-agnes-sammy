import { and, count, eq, gt, ne, or, sql } from "drizzle-orm";
import { giftContributions } from "@/shared/db/schema";
import type { Database } from "@/shared/db/types";
import type { GiftCommitment } from "@/modules/contributions/types";

export async function queryGiftCommitment(
  database: Database,
  giftId: string,
  now: Date,
  excludedContributionId?: string,
): Promise<GiftCommitment> {
  const countsTowardTotal = or(
    eq(giftContributions.status, "confirmed"),
    and(eq(giftContributions.status, "reserved"), gt(giftContributions.expiresAt, now)),
  );
  const exclusion = excludedContributionId
    ? ne(giftContributions.id, excludedContributionId)
    : undefined;
  const [row] = await database
    .select({
      committedQuotas: sql<number>`coalesce(sum(${giftContributions.quotas}), 0)::int`,
      committedAmountCents: sql<number>`coalesce(sum(${giftContributions.amountCents}), 0)::int`,
      committedCount: count(),
    })
    .from(giftContributions)
    .where(and(eq(giftContributions.giftId, giftId), countsTowardTotal, exclusion));
  return {
    committedQuotas: row?.committedQuotas ?? 0,
    committedAmountCents: row?.committedAmountCents ?? 0,
    committedCount: row?.committedCount ?? 0,
  };
}
