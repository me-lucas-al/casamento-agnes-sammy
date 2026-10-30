import { and, count, eq, gt, inArray } from "drizzle-orm";
import { giftContributions, gifts, guests } from "@/shared/db/schema";
import type { Database } from "@/shared/db/types";
import { confirmContribution } from "./confirm-contribution";
import { queryGiftCommitment } from "./commitment-query";
import { toReservableGift } from "./reservable-gift-mapper";
import type { ReservationStore, ReservationUnitOfWork } from "./reservation-unit-of-work";

const EDITABLE_STATUSES = ["reserved", "confirmed"] as const;

function createReservationStore(database: Database): ReservationStore {
  return {
    async lockReservableGift(giftId) {
      const [row] = await database
        .select()
        .from(gifts)
        .where(eq(gifts.id, giftId))
        .limit(1)
        .for("update");
      return row ? toReservableGift(row) : null;
    },
    findCommitment(giftId, now, excludedContributionId) {
      return queryGiftCommitment(database, giftId, now, excludedContributionId);
    },
    async insertReservation(newReservation) {
      const [contribution] = await database
        .insert(giftContributions)
        .values({ ...newReservation, status: "reserved" })
        .returning();
      return contribution;
    },
    async countActiveReservations(guestId, now) {
      await database.select({ id: guests.id }).from(guests).where(eq(guests.id, guestId)).for("update");
      const [row] = await database
        .select({ total: count() })
        .from(giftContributions)
        .where(
          and(
            eq(giftContributions.guestId, guestId),
            eq(giftContributions.status, "reserved"),
            gt(giftContributions.expiresAt, now),
          ),
        );
      return row?.total ?? 0;
    },
    confirmReservation(input) {
      return confirmContribution(database, input);
    },
    async findContribution(contributionId) {
      const [contribution] = await database
        .select()
        .from(giftContributions)
        .where(eq(giftContributions.id, contributionId))
        .limit(1);
      return contribution ?? null;
    },
    async updateAmounts(contributionId, { quotas, amountCents, anonymous }) {
      const [contribution] = await database
        .update(giftContributions)
        .set({ quotas, amountCents, anonymous })
        .where(
          and(
            eq(giftContributions.id, contributionId),
            inArray(giftContributions.status, [...EDITABLE_STATUSES]),
          ),
        )
        .returning();
      return contribution ?? null;
    },
  };
}

export function createDrizzleReservationUnitOfWork(database: Database): ReservationUnitOfWork {
  return {
    run(work) {
      return database.transaction((transaction) => work(createReservationStore(transaction)));
    },
  };
}
