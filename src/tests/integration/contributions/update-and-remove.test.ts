import { describe, expect, it } from "vitest";
import { ForbiddenError } from "@/modules/auth/errors";
import {
  ContributionNotFoundError,
  ContributionNotPendingError,
  InvalidQuotasError,
} from "@/modules/contributions/errors";
import { asUser } from "@/tests/helpers/fake-session";
import { seedGift } from "@/tests/helpers/seeds/seed-gift";
import { useTestDatabase } from "@/tests/helpers/use-test-database";
import { createContributionContext, seedGuestActor, seedStaffActor } from "./contribution-context";

describe("update and remove contributions", () => {
  const testDatabase = useTestDatabase();

  async function setupQuotaReservation() {
    const context = createContributionContext(testDatabase.db);
    const gift = await seedGift(testDatabase.db, { mode: "fixed_quotas", totalQuotas: 4, priceCents: 40000 });
    const guest = await seedGuestActor(testDatabase.db);
    const contribution = await context.contributions.reserveGift(guest, { giftId: gift.id, quotas: 1 });
    return { ...context, gift, guest, contribution };
  }

  it("lets a guest change the quotas of their own reservation", async () => {
    const { contributions, guest, contribution } = await setupQuotaReservation();

    const updated = await contributions.updateReservation(guest, {
      contributionId: contribution.id,
      quotas: 3,
    });

    expect(updated).toMatchObject({ quotas: 3, amountCents: 30000 });
  });

  it("does not count the edited reservation twice against availability", async () => {
    const { contributions, guest, contribution } = await setupQuotaReservation();

    await expect(
      contributions.updateReservation(guest, { contributionId: contribution.id, quotas: 4 }),
    ).resolves.toMatchObject({ quotas: 4 });
    await expect(
      contributions.updateReservation(guest, { contributionId: contribution.id, quotas: 5 }),
    ).rejects.toBeInstanceOf(InvalidQuotasError);
  });

  it("hides other guests' reservations from edit attempts", async () => {
    const { contributions, contribution } = await setupQuotaReservation();
    const stranger = await seedGuestActor(testDatabase.db);

    await expect(
      contributions.updateReservation(stranger, { contributionId: contribution.id, quotas: 2 }),
    ).rejects.toBeInstanceOf(ContributionNotFoundError);
  });

  it("forbids a guest from editing once confirmed, but staff can", async () => {
    const { contributions, guest, contribution } = await setupQuotaReservation();
    await contributions.confirmPixPayment(await seedStaffActor(testDatabase.db, "couple"), { contributionId: contribution.id });

    await expect(
      contributions.updateReservation(guest, { contributionId: contribution.id, quotas: 2 }),
    ).rejects.toBeInstanceOf(ContributionNotPendingError);
    await expect(
      contributions.updateReservation(asUser("admin"), { contributionId: contribution.id, quotas: 2 }),
    ).resolves.toMatchObject({ quotas: 2, status: "confirmed" });
  });

  it("lets staff edit any reservation", async () => {
    const { contributions, contribution } = await setupQuotaReservation();

    await expect(
      contributions.updateReservation(asUser("couple"), { contributionId: contribution.id, quotas: 2 }),
    ).resolves.toMatchObject({ quotas: 2 });
  });

  it("only lets staff hard-remove contributions", async () => {
    const { contributions, guest, contribution } = await setupQuotaReservation();

    await expect(contributions.removeContribution(guest, contribution.id)).rejects.toBeInstanceOf(
      ForbiddenError,
    );
    await expect(
      contributions.removeContribution(asUser("couple"), contribution.id),
    ).resolves.toMatchObject({ id: contribution.id });
    await expect(
      contributions.removeContribution(asUser("admin"), contribution.id),
    ).rejects.toBeInstanceOf(ContributionNotFoundError);
  });
});
