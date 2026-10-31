import { describe, expect, it } from "vitest";
import { ForbiddenError } from "@/modules/auth/errors";
import { ContributionNotFoundError, ContributionNotPendingError } from "@/modules/contributions/errors";
import { messages } from "@/shared/db/schema";
import { asUser } from "@/tests/helpers/fakes/fake-session";
import { seedGift } from "@/tests/helpers/database/seeds/seed-gift";
import { useTestDatabase } from "@/tests/helpers/database/use-test-database";
import { createContributionContext, seedGuestActor, seedStaffActor } from "./contribution-context";

describe("confirm and cancel contributions", () => {
  const testDatabase = useTestDatabase();

  async function setupReservation() {
    const context = createContributionContext(testDatabase.db);
    const gift = await seedGift(testDatabase.db);
    const guest = await seedGuestActor(testDatabase.db, "Maria");
    const contribution = await context.contributions.reserveGift(guest, { giftId: gift.id });
    return { ...context, gift, guest, contribution };
  }

  it("confirms a payment and records who and when", async () => {
    const { contributions, contribution, clock } = await setupReservation();
    const couple = await seedStaffActor(testDatabase.db, "couple");

    const confirmed = await contributions.confirmPixPayment(couple, { contributionId: contribution.id });

    expect(confirmed).toMatchObject({ status: "confirmed", confirmedBy: couple.id });
    expect(confirmed.confirmedAt).toEqual(clock());
  });

  it("creates a pending message only when a body is provided", async () => {
    const { contributions, contribution } = await setupReservation();

    await contributions.confirmPixPayment(await seedStaffActor(testDatabase.db, "admin"), {
      contributionId: contribution.id,
      message: "  Felicidades!  ",
    });

    const rows = await testDatabase.db.select().from(messages);
    expect(rows).toHaveLength(1);
    expect(rows[0]).toMatchObject({
      body: "Felicidades!",
      status: "pending",
      authorName: "Maria",
      contributionId: contribution.id,
    });
  });

  it("creates no message when the body is blank", async () => {
    const { contributions, contribution } = await setupReservation();

    await contributions.confirmPixPayment(await seedStaffActor(testDatabase.db, "admin"), { contributionId: contribution.id, message: "   " });

    expect(await testDatabase.db.select().from(messages)).toHaveLength(0);
  });

  it("keeps the gift taken after confirmation, even past 48 hours", async () => {
    const { contributions, gift, contribution, advanceHours } = await setupReservation();
    await contributions.confirmPixPayment(await seedStaffActor(testDatabase.db, "couple"), { contributionId: contribution.id });
    advanceHours(100);

    const view = await contributions.getGiftAvailability(asUser("couple"), gift.id);

    expect(view.availability.isComplete).toBe(true);
  });

  it.each(["guest", "none"] as const)("forbids confirming as %s", async (kind) => {
    const { contributions, contribution, guest } = await setupReservation();
    const actor = kind === "guest" ? guest : null;

    await expect(
      contributions.confirmPixPayment(actor, { contributionId: contribution.id }),
    ).rejects.toThrow();
  });

  it("rejects confirming twice or confirming a missing contribution", async () => {
    const { contributions, contribution } = await setupReservation();
    const couple = await seedStaffActor(testDatabase.db, "couple");
    await contributions.confirmPixPayment(couple, { contributionId: contribution.id });

    await expect(
      contributions.confirmPixPayment(couple, { contributionId: contribution.id }),
    ).rejects.toBeInstanceOf(ContributionNotPendingError);
    await expect(
      contributions.confirmPixPayment(couple, { contributionId: crypto.randomUUID() }),
    ).rejects.toBeInstanceOf(ContributionNotFoundError);
  });

  it("lets a guest cancel their own reservation and frees the gift", async () => {
    const { contributions, guest, gift, contribution } = await setupReservation();

    const cancelled = await contributions.cancelOwnReservation(guest, contribution.id);

    expect(cancelled.status).toBe("cancelled");
    const other = await seedGuestActor(testDatabase.db);
    await expect(contributions.reserveGift(other, { giftId: gift.id })).resolves.toBeDefined();
  });

  it("does not let a guest cancel someone else's reservation", async () => {
    const { contributions, contribution } = await setupReservation();
    const stranger = await seedGuestActor(testDatabase.db);

    await expect(
      contributions.cancelOwnReservation(stranger, contribution.id),
    ).rejects.toBeInstanceOf(ContributionNotFoundError);
  });

  it("does not let a guest cancel once confirmed", async () => {
    const { contributions, guest, contribution } = await setupReservation();
    await contributions.confirmPixPayment(await seedStaffActor(testDatabase.db, "couple"), { contributionId: contribution.id });

    await expect(
      contributions.cancelOwnReservation(guest, contribution.id),
    ).rejects.toBeInstanceOf(ContributionNotPendingError);
  });

  it("lets the couple reject a reservation or cancel a confirmed one", async () => {
    const { contributions, contribution } = await setupReservation();

    await expect(
      contributions.rejectOrCancelByCouple(asUser("couple"), contribution.id),
    ).resolves.toMatchObject({ status: "cancelled" });
    await expect(
      contributions.rejectOrCancelByCouple(asUser("admin"), contribution.id),
    ).rejects.toBeInstanceOf(ContributionNotPendingError);
  });

  it("forbids guests from rejecting by couple", async () => {
    const { contributions, guest, contribution } = await setupReservation();

    await expect(contributions.rejectOrCancelByCouple(guest, contribution.id)).rejects.toBeInstanceOf(
      ForbiddenError,
    );
  });
});
