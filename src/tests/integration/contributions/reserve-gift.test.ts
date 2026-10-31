import { describe, expect, it } from "vitest";
import { ForbiddenError, UnauthenticatedError } from "@/modules/auth/errors";
import { GiftUnavailableError, InvalidAmountError, InvalidQuotasError } from "@/modules/contributions/errors";
import { asUser } from "@/tests/helpers/fakes/fake-session";
import { seedGift } from "@/tests/helpers/database/seeds/seed-gift";
import { useTestDatabase } from "@/tests/helpers/database/use-test-database";
import { createContributionContext, seedGuestActor } from "./contribution-context";

describe("reserveGift", () => {
  const testDatabase = useTestDatabase();
  const setup = () => createContributionContext(testDatabase.db);

  it("reserves a single gift for 48 hours at the full price", async () => {
    const { contributions, clock } = setup();
    const gift = await seedGift(testDatabase.db, { priceCents: 25000 });
    const guest = await seedGuestActor(testDatabase.db);

    const contribution = await contributions.reserveGift(guest, { giftId: gift.id });

    expect(contribution).toMatchObject({ status: "reserved", amountCents: 25000, quotas: null });
    expect(contribution.expiresAt.getTime()).toBe(clock().getTime() + 48 * 60 * 60 * 1000);
  });

  it("blocks a second guest from taking a single gift", async () => {
    const { contributions } = setup();
    const gift = await seedGift(testDatabase.db);
    await contributions.reserveGift(await seedGuestActor(testDatabase.db), { giftId: gift.id });

    await expect(
      contributions.reserveGift(await seedGuestActor(testDatabase.db), { giftId: gift.id }),
    ).rejects.toBeInstanceOf(GiftUnavailableError);
  });

  it("reserves quotas until the gift is complete", async () => {
    const { contributions } = setup();
    const gift = await seedGift(testDatabase.db, {
      mode: "fixed_quotas",
      totalQuotas: 3,
      priceCents: 30000,
    });
    const guest = await seedGuestActor(testDatabase.db);

    const first = await contributions.reserveGift(guest, { giftId: gift.id, quotas: 2 });
    const second = await contributions.reserveGift(guest, { giftId: gift.id, quotas: 1 });

    expect([first.amountCents, second.amountCents]).toEqual([20000, 10000]);
    await expect(
      contributions.reserveGift(guest, { giftId: gift.id, quotas: 1 }),
    ).rejects.toBeInstanceOf(GiftUnavailableError);
  });

  it("rejects more quotas than remain", async () => {
    const { contributions } = setup();
    const gift = await seedGift(testDatabase.db, { mode: "fixed_quotas", totalQuotas: 2 });

    await expect(
      contributions.reserveGift(await seedGuestActor(testDatabase.db), { giftId: gift.id, quotas: 3 }),
    ).rejects.toBeInstanceOf(InvalidQuotasError);
  });

  it("validates free amounts against minimum and remaining", async () => {
    const { contributions } = setup();
    const gift = await seedGift(testDatabase.db, {
      mode: "free_amount",
      priceCents: 20000,
      minAmountCents: 5000,
    });
    const guest = await seedGuestActor(testDatabase.db);

    await expect(
      contributions.reserveGift(guest, { giftId: gift.id, amountCents: 1000 }),
    ).rejects.toBeInstanceOf(InvalidAmountError);
    await contributions.reserveGift(guest, { giftId: gift.id, amountCents: 15000 });
    await expect(
      contributions.reserveGift(guest, { giftId: gift.id, amountCents: 6000 }),
    ).rejects.toBeInstanceOf(InvalidAmountError);
    await expect(
      contributions.reserveGift(guest, { giftId: gift.id, amountCents: 5000 }),
    ).resolves.toMatchObject({ amountCents: 5000 });
  });

  it("treats hidden gifts as unavailable", async () => {
    const { contributions } = setup();
    const gift = await seedGift(testDatabase.db, { isVisible: false });

    await expect(
      contributions.reserveGift(await seedGuestActor(testDatabase.db), { giftId: gift.id }),
    ).rejects.toBeInstanceOf(GiftUnavailableError);
  });

  it("frees the item after the reservation expires", async () => {
    const { contributions, advanceHours } = setup();
    const gift = await seedGift(testDatabase.db);
    await contributions.reserveGift(await seedGuestActor(testDatabase.db), { giftId: gift.id });

    advanceHours(49);

    await expect(
      contributions.reserveGift(await seedGuestActor(testDatabase.db), { giftId: gift.id }),
    ).resolves.toMatchObject({ status: "reserved" });
  });

  it("is guest-only", async () => {
    const { contributions } = setup();
    const gift = await seedGift(testDatabase.db);

    await expect(contributions.reserveGift(null, { giftId: gift.id })).rejects.toBeInstanceOf(
      UnauthenticatedError,
    );
    for (const role of ["admin", "couple"] as const) {
      await expect(contributions.reserveGift(asUser(role), { giftId: gift.id })).rejects.toBeInstanceOf(
        ForbiddenError,
      );
    }
  });

  it("never exceeds the total quotas under concurrent reservations", async () => {
    const { contributions } = setup();
    const gift = await seedGift(testDatabase.db, { mode: "fixed_quotas", totalQuotas: 5, priceCents: 50000 });
    const guests = await Promise.all(
      Array.from({ length: 12 }, () => seedGuestActor(testDatabase.db)),
    );

    const outcomes = await Promise.allSettled(
      guests.map((guest) => contributions.reserveGift(guest, { giftId: gift.id, quotas: 1 })),
    );

    const fulfilled = outcomes.filter((outcome) => outcome.status === "fulfilled");
    expect(fulfilled).toHaveLength(5);
    const view = await contributions.getGiftAvailability(guests[0], gift.id);
    expect(view.availability).toMatchObject({ remainingQuotas: 0, isComplete: true });
  });

  it("lets only one guest win a single gift under concurrency", async () => {
    const { contributions } = setup();
    const gift = await seedGift(testDatabase.db);
    const guests = await Promise.all(
      Array.from({ length: 6 }, () => seedGuestActor(testDatabase.db)),
    );

    const outcomes = await Promise.allSettled(
      guests.map((guest) => contributions.reserveGift(guest, { giftId: gift.id })),
    );

    expect(outcomes.filter((outcome) => outcome.status === "fulfilled")).toHaveLength(1);
  });
});
