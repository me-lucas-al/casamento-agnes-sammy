import { eq } from "drizzle-orm";
import { describe, expect, it } from "vitest";
import { GiftHasActiveReservationsError, GiftHasConfirmedContributionError } from "@/modules/gifts/errors";
import { GuestHasConfirmedContributionsError } from "@/modules/guests/errors";
import { createGuestModule } from "@/modules/guests/factory";
import { giftContributions, gifts, guests } from "@/shared/db/schema";
import { asUser } from "@/tests/helpers/fake-session";
import { seedGift } from "@/tests/helpers/seeds/seed-gift";
import { useTestDatabase } from "@/tests/helpers/use-test-database";
import { createTestGiftModule } from "../gifts/gift-test-module";
import { createContributionContext, seedGuestActor, seedStaffActor } from "./contribution-context";

describe("deleting gifts and guests against contributions", () => {
  const testDatabase = useTestDatabase();

  async function reserveGift() {
    const context = createContributionContext(testDatabase.db);
    const gift = await seedGift(testDatabase.db);
    const guest = await seedGuestActor(testDatabase.db);
    const contribution = await context.contributions.reserveGift(guest, { giftId: gift.id });
    const { giftModule } = createTestGiftModule(testDatabase.db, { now: context.clock });
    return { ...context, gift, guest, contribution, giftModule };
  }

  it("refuses to delete a gift with an active reservation", async () => {
    const { giftModule, gift } = await reserveGift();

    await expect(giftModule.deleteGift(asUser("admin"), gift.id)).rejects.toBeInstanceOf(
      GiftHasActiveReservationsError,
    );
    expect(await testDatabase.db.select().from(gifts).where(eq(gifts.id, gift.id))).toHaveLength(1);
  });

  it("deletes a gift whose reservation already expired", async () => {
    const { giftModule, gift, advanceHours } = await reserveGift();
    advanceHours(49);

    await giftModule.deleteGift(asUser("admin"), gift.id);

    expect(await testDatabase.db.select().from(gifts).where(eq(gifts.id, gift.id))).toHaveLength(0);
  });

  it("never loses a confirmation when the gift is deleted afterwards", async () => {
    const { giftModule, gift, contributions, contribution } = await reserveGift();
    await contributions.confirmPixPayment(await seedStaffActor(testDatabase.db), {
      contributionId: contribution.id,
    });

    await expect(giftModule.deleteGift(asUser("admin"), gift.id)).rejects.toBeInstanceOf(
      GiftHasConfirmedContributionError,
    );
    const rows = await testDatabase.db
      .select()
      .from(giftContributions)
      .where(eq(giftContributions.id, contribution.id));
    expect(rows[0]?.status).toBe("confirmed");
  });

  it("cannot confirm a contribution whose gift was deleted", async () => {
    const { giftModule, gift, contributions, contribution, advanceHours } = await reserveGift();
    advanceHours(49);
    await giftModule.deleteGift(asUser("admin"), gift.id);

    await expect(
      contributions.confirmPixPayment(await seedStaffActor(testDatabase.db), {
        contributionId: contribution.id,
      }),
    ).rejects.toThrow();
    expect(await testDatabase.db.select().from(giftContributions)).toHaveLength(0);
  });

  it("never loses a confirmation when the guest is deleted afterwards", async () => {
    const { guest, contributions, contribution } = await reserveGift();
    await contributions.confirmPixPayment(await seedStaffActor(testDatabase.db), {
      contributionId: contribution.id,
    });

    await expect(createGuestModule(testDatabase.db).deleteGuest(asUser("admin"), guest.id)).rejects.toBeInstanceOf(
      GuestHasConfirmedContributionsError,
    );
    expect(await testDatabase.db.select().from(guests).where(eq(guests.id, guest.id))).toHaveLength(1);
    expect(await testDatabase.db.select().from(giftContributions)).toHaveLength(1);
  });
});
