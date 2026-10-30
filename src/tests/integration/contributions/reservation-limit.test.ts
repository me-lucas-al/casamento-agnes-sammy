import { describe, expect, it } from "vitest";
import { describeContributionError, TooManyActiveReservationsError } from "@/modules/contributions/errors";
import { MAX_ACTIVE_RESERVATIONS_PER_GUEST } from "@/modules/contributions/lib/reservation-window";
import { seedGift } from "@/tests/helpers/seeds/seed-gift";
import { useTestDatabase } from "@/tests/helpers/use-test-database";
import { createContributionContext, seedGuestActor } from "./contribution-context";

type Context = ReturnType<typeof createContributionContext>;
type Guest = Awaited<ReturnType<typeof seedGuestActor>>;

describe("active reservation limit per guest", () => {
  const testDatabase = useTestDatabase();

  async function reserveNewGift(context: Context, guest: Guest) {
    const gift = await seedGift(testDatabase.db);
    return context.contributions.reserveGift(guest, { giftId: gift.id });
  }

  async function fillLimit(context: Context, guest: Guest) {
    const reservations = [];
    for (let index = 0; index < MAX_ACTIVE_RESERVATIONS_PER_GUEST; index += 1) {
      reservations.push(await reserveNewGift(context, guest));
    }
    return reservations;
  }

  it("refuses a reservation beyond the limit without touching other guests", async () => {
    const context = createContributionContext(testDatabase.db);
    const guest = await seedGuestActor(testDatabase.db);
    await fillLimit(context, guest);

    await expect(reserveNewGift(context, guest)).rejects.toBeInstanceOf(TooManyActiveReservationsError);
    await expect(reserveNewGift(context, await seedGuestActor(testDatabase.db))).resolves.toBeDefined();
  });

  it("frees a slot when a reservation is cancelled", async () => {
    const context = createContributionContext(testDatabase.db);
    const guest = await seedGuestActor(testDatabase.db);
    const [first] = await fillLimit(context, guest);
    await context.contributions.cancelOwnReservation(guest, first.id);

    await expect(reserveNewGift(context, guest)).resolves.toBeDefined();
  });

  it("does not count expired reservations", async () => {
    const context = createContributionContext(testDatabase.db);
    const guest = await seedGuestActor(testDatabase.db);
    await fillLimit(context, guest);
    context.advanceHours(49);

    await expect(reserveNewGift(context, guest)).resolves.toBeDefined();
  });

  it("describes the limit in Portuguese", () => {
    expect(describeContributionError(new TooManyActiveReservationsError(5))).toContain("5 reservas pendentes");
  });
});
