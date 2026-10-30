import { and, count, eq, gt, or, sql } from "drizzle-orm";
import { giftContributions } from "@/shared/db/schema";
import type { Database } from "@/shared/db/types";
import type { PendingPaymentTotals, ReservationTotals } from "../types";

type ContributionTotals = { reservations: ReservationTotals; pendingPayments: PendingPaymentTotals };

export async function readContributionTotals(database: Database, now: Date): Promise<ContributionTotals> {
  const rows = await database
    .select({
      status: giftContributions.status,
      total: count(),
      amountCents: sql<number>`coalesce(sum(${giftContributions.amountCents}), 0)::int`,
    })
    .from(giftContributions)
    .where(
      or(
        eq(giftContributions.status, "confirmed"),
        and(eq(giftContributions.status, "reserved"), gt(giftContributions.expiresAt, now)),
      ),
    )
    .groupBy(giftContributions.status);
  const reserved = rows.find((row) => row.status === "reserved");
  const confirmed = rows.find((row) => row.status === "confirmed");
  return {
    reservations: { reserved: reserved?.total ?? 0, confirmed: confirmed?.total ?? 0 },
    pendingPayments: { count: reserved?.total ?? 0, amountCents: reserved?.amountCents ?? 0 },
  };
}
