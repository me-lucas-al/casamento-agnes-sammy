import { describe, expect, it } from "vitest";
import { createContributionController } from "@/modules/contributions/controllers/contribution-controller";
import type { SessionUser } from "@/modules/auth/types";
import { asUser } from "@/tests/helpers/fake-session";
import { FakeCacheInvalidator } from "@/tests/helpers/fake-cache-invalidator";
import { seedGift } from "@/tests/helpers/seeds/seed-gift";
import { useTestDatabase } from "@/tests/helpers/use-test-database";
import { createContributionContext, seedGuestActor, seedStaffActor } from "./contribution-context";

describe("contribution controller", () => {
  const testDatabase = useTestDatabase();

  function setup(initialActor: SessionUser | null) {
    const context = createContributionContext(testDatabase.db);
    const invalidator = new FakeCacheInvalidator();
    let actor = initialActor;
    const controller = createContributionController({
      contributions: context.contributions,
      invalidator,
      getActor: async () => actor,
    });
    return { ...context, invalidator, controller, actAs: (next: SessionUser | null) => (actor = next) };
  }

  it("invalidates every related tag after reserving", async () => {
    const guest = await seedGuestActor(testDatabase.db);
    const { controller, invalidator } = setup(guest);
    const gift = await seedGift(testDatabase.db);

    const result = await controller.reserveGift({ giftId: gift.id });

    expect(result.ok).toBe(true);
    expect(invalidator.invalidatedTags.sort()).toEqual(
      ["gifts", `gift:${gift.id}`, `contributions:${guest.guestId}`, "payments:pending"].sort(),
    );
  });

  it("invalidates tags on confirm, cancel, update and removal", async () => {
    const guest = await seedGuestActor(testDatabase.db);
    const { controller, invalidator, actAs } = setup(guest);
    const gift = await seedGift(testDatabase.db, { mode: "fixed_quotas", totalQuotas: 5 });
    const reserved = await controller.reserveGift({ giftId: gift.id, quotas: 1 });
    if (!reserved.ok) throw new Error(reserved.error);
    const { contributionId } = reserved.data;

    invalidator.reset();
    await controller.updateReservation({ contributionId, quotas: 2 });
    expect(invalidator.invalidatedTags).toContain("payments:pending");

    invalidator.reset();
    actAs(await seedStaffActor(testDatabase.db, "couple"));
    await controller.confirmPixPayment({ contributionId, message: "oi" });
    expect(invalidator.invalidatedTags).toContain(`gift:${gift.id}`);

    invalidator.reset();
    await controller.rejectOrCancelByCouple({ contributionId });
    expect(invalidator.invalidatedTags).toContain(`contributions:${guest.guestId}`);

    invalidator.reset();
    await controller.removeContribution({ contributionId });
    expect(invalidator.invalidatedTags).toContain("gifts");
  });

  it("invalidates when a guest cancels their own reservation", async () => {
    const guest = await seedGuestActor(testDatabase.db);
    const { controller, invalidator } = setup(guest);
    const gift = await seedGift(testDatabase.db);
    const reserved = await controller.reserveGift({ giftId: gift.id });
    if (!reserved.ok) throw new Error(reserved.error);
    invalidator.reset();

    const result = await controller.cancelOwnReservation({ contributionId: reserved.data.contributionId });

    expect(result.ok).toBe(true);
    expect(invalidator.invalidatedTags).toContain("gifts");
  });

  it("maps business errors to pt-BR and does not invalidate on failure", async () => {
    const guest = await seedGuestActor(testDatabase.db);
    const { controller, invalidator } = setup(guest);
    const gift = await seedGift(testDatabase.db);
    await controller.reserveGift({ giftId: gift.id });
    invalidator.reset();

    const second = await controller.reserveGift({ giftId: gift.id });

    expect(second).toEqual({ ok: false, error: "Este presente não está mais disponível." });
    expect(invalidator.invalidatedTags).toEqual([]);
  });

  it("maps permission errors and invalid input", async () => {
    const { controller } = setup(asUser("couple"));

    expect(await controller.reserveGift({ giftId: crypto.randomUUID() })).toEqual({
      ok: false,
      error: "Você não tem permissão para esta ação.",
    });
    expect(await controller.reserveGift({ giftId: "x" })).toEqual({ ok: false, error: expect.stringContaining("Dados inválidos.") });
    expect(await controller.confirmPixPayment({})).toEqual({ ok: false, error: expect.stringContaining("Dados inválidos.") });
  });

  it("invalidates gifts and pending payments only when the cron expires something", async () => {
    const guest = await seedGuestActor(testDatabase.db);
    const { controller, invalidator, advanceHours } = setup(guest);
    const gift = await seedGift(testDatabase.db);
    await controller.reserveGift({ giftId: gift.id });
    invalidator.reset();

    expect(await controller.expireReservations()).toBe(0);
    expect(invalidator.invalidatedTags).toEqual([]);

    advanceHours(49);
    expect(await controller.expireReservations()).toBe(1);
    expect(invalidator.invalidatedTags.sort()).toEqual(["gifts", "payments:pending"]);
  });
});
