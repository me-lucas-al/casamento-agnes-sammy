import { describe, expect, it } from "vitest";
import { asUser } from "@/tests/helpers/fake-session";
import { seedGift } from "@/tests/helpers/seeds/seed-gift";
import { useTestDatabase } from "@/tests/helpers/use-test-database";
import { createContributionContext, seedGuestActor, seedStaffActor } from "./contribution-context";

describe("expireReservations", () => {
  const testDatabase = useTestDatabase();

  async function setupReservation() {
    const context = createContributionContext(testDatabase.db);
    const gift = await seedGift(testDatabase.db);
    const guest = await seedGuestActor(testDatabase.db);
    const contribution = await context.contributions.reserveGift(guest, { giftId: gift.id });
    return { ...context, gift, contribution };
  }

  it("expires overdue reservations and returns the count", async () => {
    const { contributions, gift, contribution, advanceHours } = await setupReservation();
    advanceHours(49);

    const expiredCount = await contributions.expireReservations();

    expect(expiredCount).toBe(1);
    expect(await contributions.contributionRepository.findById(contribution.id)).toMatchObject({
      status: "expired",
    });
    expect(await contributions.expireReservations()).toBe(0);
    const view = await contributions.getGiftAvailability(asUser("couple"), gift.id);
    expect(view.availability.isComplete).toBe(false);
  });

  it("leaves confirmed contributions alone when expiring", async () => {
    const { contributions, contribution, advanceHours } = await setupReservation();
    await contributions.confirmPixPayment(await seedStaffActor(testDatabase.db, "couple"), { contributionId: contribution.id });
    advanceHours(100);

    expect(await contributions.expireReservations()).toBe(0);
    expect(await contributions.contributionRepository.findById(contribution.id)).toMatchObject({
      status: "confirmed",
    });
  });
});
