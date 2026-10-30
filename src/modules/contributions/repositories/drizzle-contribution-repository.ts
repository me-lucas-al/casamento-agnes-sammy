import { and, desc, eq, inArray, lte } from "drizzle-orm";
import { giftContributions, gifts, guests, messages } from "@/shared/db/schema";
import type { Database } from "@/shared/db/types";
import { queryGiftCommitment } from "./commitment-query";
import type { ContributionRepository } from "./contribution-repository";
import { queryPendingPaymentsPage } from "./pending-payments-query";
import { toReservableGift } from "./reservable-gift-mapper";

export function createDrizzleContributionRepository(database: Database): ContributionRepository {
  return {
    async findById(contributionId) {
      const [contribution] = await database
        .select()
        .from(giftContributions)
        .where(eq(giftContributions.id, contributionId))
        .limit(1);
      return contribution ?? null;
    },
    async findGiftWithCommitment(giftId, now) {
      const [row] = await database.select().from(gifts).where(eq(gifts.id, giftId)).limit(1);
      if (!row) return null;
      return {
        gift: toReservableGift(row),
        commitment: await queryGiftCommitment(database, giftId, now),
      };
    },
    async cancel(contributionId, allowedStatuses) {
      const [contribution] = await database
        .update(giftContributions)
        .set({ status: "cancelled" })
        .where(
          and(
            eq(giftContributions.id, contributionId),
            inArray(giftContributions.status, [...allowedStatuses]),
          ),
        )
        .returning();
      return contribution ?? null;
    },
    confirm({ contributionId, confirmedBy, confirmedAt, message }) {
      return database.transaction(async (transaction) => {
        const [contribution] = await transaction
          .update(giftContributions)
          .set({ status: "confirmed", confirmedBy, confirmedAt })
          .where(
            and(eq(giftContributions.id, contributionId), eq(giftContributions.status, "reserved")),
          )
          .returning();
        if (!contribution || !message) return contribution ?? null;
        const [guest] = await transaction
          .select({ name: guests.name })
          .from(guests)
          .where(eq(guests.id, contribution.guestId))
          .limit(1);
        await transaction.insert(messages).values({
          guestId: contribution.guestId,
          authorName: guest?.name ?? "Convidado",
          body: message,
          status: "pending",
          contributionId: contribution.id,
        });
        return contribution;
      });
    },
    async remove(contributionId) {
      const [contribution] = await database
        .delete(giftContributions)
        .where(eq(giftContributions.id, contributionId))
        .returning();
      return contribution ?? null;
    },
    async expireDue(now) {
      const expired = await database
        .update(giftContributions)
        .set({ status: "expired" })
        .where(and(eq(giftContributions.status, "reserved"), lte(giftContributions.expiresAt, now)))
        .returning({ id: giftContributions.id });
      return expired.length;
    },
    async listByGuest(guestId) {
      const rows = await database
        .select({ contribution: giftContributions, giftName: gifts.name, giftImageUrl: gifts.imageUrl })
        .from(giftContributions)
        .innerJoin(gifts, eq(gifts.id, giftContributions.giftId))
        .where(eq(giftContributions.guestId, guestId))
        .orderBy(desc(giftContributions.createdAt));
      return rows.map(({ contribution, giftName, giftImageUrl }) => ({
        ...contribution,
        giftName,
        giftImageUrl,
      }));
    },
    listPendingPage(query) {
      return queryPendingPaymentsPage(database, query);
    },
  };
}
