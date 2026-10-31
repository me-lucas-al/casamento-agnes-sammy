import { describe, expect, it } from "vitest";
import { GiftUnavailableError, InvalidQuotasError } from "@/modules/contributions/errors";
import { giftContributions } from "@/shared/db/schema";
import { seedGift } from "@/tests/helpers/database/seeds/seed-gift";
import { useTestDatabase } from "@/tests/helpers/database/use-test-database";
import { createContributionContext, seedGuestActor, seedStaffActor } from "./contribution-context";

describe("confirming after the reservation window", () => {
  const testDatabase = useTestDatabase();

  it("refuses to confirm an expired single-gift reservation taken by someone else", async () => {
    const { contributions, advanceHours } = createContributionContext(testDatabase.db);
    const gift = await seedGift(testDatabase.db);
    const first = await contributions.reserveGift(await seedGuestActor(testDatabase.db), { giftId: gift.id });
    advanceHours(49);
    await contributions.reserveGift(await seedGuestActor(testDatabase.db), { giftId: gift.id });

    await expect(
      contributions.confirmPixPayment(await seedStaffActor(testDatabase.db), { contributionId: first.id }),
    ).rejects.toBeInstanceOf(GiftUnavailableError);

    const rows = await testDatabase.db.select().from(giftContributions);
    expect(rows.filter(({ status }) => status === "confirmed")).toHaveLength(0);
  });

  it("refuses to confirm expired quotas that were taken meanwhile", async () => {
    const { contributions, advanceHours } = createContributionContext(testDatabase.db);
    const gift = await seedGift(testDatabase.db, { mode: "fixed_quotas", totalQuotas: 3, priceCents: 30000 });
    const first = await contributions.reserveGift(await seedGuestActor(testDatabase.db), {
      giftId: gift.id,
      quotas: 2,
    });
    advanceHours(49);
    await contributions.reserveGift(await seedGuestActor(testDatabase.db), { giftId: gift.id, quotas: 2 });

    await expect(
      contributions.confirmPixPayment(await seedStaffActor(testDatabase.db), { contributionId: first.id }),
    ).rejects.toBeInstanceOf(GiftUnavailableError);
  });

  it("confirms an expired reservation when its share is still available", async () => {
    const { contributions, advanceHours } = createContributionContext(testDatabase.db);
    const gift = await seedGift(testDatabase.db);
    const reservation = await contributions.reserveGift(await seedGuestActor(testDatabase.db), {
      giftId: gift.id,
    });
    advanceHours(49);

    const confirmed = await contributions.confirmPixPayment(await seedStaffActor(testDatabase.db), {
      contributionId: reservation.id,
    });

    expect(confirmed.status).toBe("confirmed");
  });

  it("keeps the same invariant when staff edits a confirmed contribution", async () => {
    const { contributions } = createContributionContext(testDatabase.db);
    const gift = await seedGift(testDatabase.db, { mode: "fixed_quotas", totalQuotas: 4, priceCents: 40000 });
    const staff = await seedStaffActor(testDatabase.db);
    const first = await contributions.reserveGift(await seedGuestActor(testDatabase.db), {
      giftId: gift.id,
      quotas: 2,
    });
    await contributions.confirmPixPayment(staff, { contributionId: first.id });
    await contributions.reserveGift(await seedGuestActor(testDatabase.db), { giftId: gift.id, quotas: 2 });

    await expect(
      contributions.updateReservation(staff, { contributionId: first.id, quotas: 3 }),
    ).rejects.toBeInstanceOf(InvalidQuotasError);
  });
});
