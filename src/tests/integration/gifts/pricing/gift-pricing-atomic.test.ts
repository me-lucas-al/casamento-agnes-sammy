import { describe, expect, it } from "vitest";
import { GiftPricingLockedError } from "@/modules/gifts/errors";
import type { GiftDraft } from "@/modules/gifts/types";
import { asUser } from "@/tests/helpers/fakes/fake-session";
import { seedContribution } from "@/tests/helpers/database/seeds/seed-contribution";
import { seedGift } from "@/tests/helpers/database/seeds/seed-gift";
import { useTestDatabase } from "@/tests/helpers/database/use-test-database";
import { addHours } from "@/shared/lib/dates/dates";
import { createContributionContext, seedGuestActor } from "@/tests/integration/contributions/contribution-context";
import { buildGiftInput, createTestGiftModule } from "../gift-test-module";

describe("atomic gift pricing lock", () => {
  const testDatabase = useTestDatabase();
  const now = new Date("2026-11-01T12:00:00.000Z");

  function draftWithPrice(priceCents: number, categoryId: string): GiftDraft {
    return { ...buildGiftInput(categoryId, { priceCents }), totalQuotas: null, minAmountCents: null, imageUrl: null, imagePublicId: null };
  }

  it("reports not_found, pricing_locked and updated from one locked transaction", async () => {
    const { giftModule } = createTestGiftModule(testDatabase.db);
    const gift = await seedGift(testDatabase.db, { priceCents: 10000 });
    const expiredGift = await seedGift(testDatabase.db, { priceCents: 10000 });
    await seedContribution(testDatabase.db, { giftId: gift.id, expiresAt: addHours(now, 1) });
    await seedContribution(testDatabase.db, { giftId: expiredGift.id, expiresAt: addHours(now, -1) });
    const { giftRepository } = giftModule;

    const locked = await giftRepository.updateUnlessPricingLocked(gift.id, draftWithPrice(20000, gift.categoryId), now);
    const updated = await giftRepository.updateUnlessPricingLocked(expiredGift.id, draftWithPrice(20000, expiredGift.categoryId), now);
    const missing = await giftRepository.updateUnlessPricingLocked(crypto.randomUUID(), draftWithPrice(1, gift.categoryId), now);

    expect(locked).toEqual({ status: "pricing_locked" });
    expect(updated).toMatchObject({ status: "updated", gift: { priceCents: 20000 } });
    expect(missing).toEqual({ status: "not_found" });
  });

  it("never lets a price change and a reservation both win", async () => {
    const { giftModule } = createTestGiftModule(testDatabase.db);
    const { contributions } = createContributionContext(testDatabase.db);
    const gift = await seedGift(testDatabase.db, { priceCents: 10000 });
    const guest = await seedGuestActor(testDatabase.db);

    const [reservation, update] = await Promise.allSettled([
      contributions.reserveGift(guest, { giftId: gift.id }),
      giftModule.updateGift(asUser("couple"), gift.id, buildGiftInput(gift.categoryId, { name: gift.name, priceCents: 20000 })),
    ]);

    expect(reservation.status).toBe("fulfilled");
    if (update.status === "rejected") return expect(update.reason).toBeInstanceOf(GiftPricingLockedError);
    if (reservation.status === "fulfilled") expect(reservation.value.amountCents).toBe(20000);
  });
});
