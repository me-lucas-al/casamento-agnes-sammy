import { describe, expect, it } from "vitest";
import { GiftPricingLockedError } from "@/modules/gifts/errors";
import { asUser } from "@/tests/helpers/fakes/fake-session";
import { seedContribution } from "@/tests/helpers/database/seeds/seed-contribution";
import { seedGift, seedGiftCategory } from "@/tests/helpers/database/seeds/seed-gift";
import { useTestDatabase } from "@/tests/helpers/database/use-test-database";
import { buildGiftInput, createTestGiftModule } from "../gift-test-module";

describe("gift pricing lock", () => {
  const testDatabase = useTestDatabase();

  it("refuses to change price or mode once a contribution is confirmed", async () => {
    const { giftModule } = createTestGiftModule(testDatabase.db);
    const category = await seedGiftCategory(testDatabase.db);
    const gift = await seedGift(testDatabase.db, { categoryId: category.id });
    await seedContribution(testDatabase.db, { giftId: gift.id, status: "confirmed" });
    const admin = asUser("admin");

    await expect(
      giftModule.updateGift(admin, gift.id, buildGiftInput(category.id, { priceCents: gift.priceCents + 100 })),
    ).rejects.toBeInstanceOf(GiftPricingLockedError);
    await expect(
      giftModule.updateGift(admin, gift.id, buildGiftInput(category.id, { mode: "free_amount", minAmountCents: 500 })),
    ).rejects.toBeInstanceOf(GiftPricingLockedError);
  });

  it("still allows editing name and visibility with contributions", async () => {
    const { giftModule } = createTestGiftModule(testDatabase.db);
    const category = await seedGiftCategory(testDatabase.db);
    const gift = await seedGift(testDatabase.db, { categoryId: category.id });
    await seedContribution(testDatabase.db, { giftId: gift.id, status: "confirmed" });

    const updated = await giftModule.updateGift(
      asUser("couple"),
      gift.id,
      buildGiftInput(category.id, {
        name: "Novo nome",
        isVisible: false,
        mode: gift.mode,
        priceCents: gift.priceCents,
        totalQuotas: gift.totalQuotas,
        minAmountCents: gift.minAmountCents,
      }),
    );

    expect(updated.name).toBe("Novo nome");
  });

  it("allows changing pricing when there are no active contributions", async () => {
    const { giftModule } = createTestGiftModule(testDatabase.db);
    const category = await seedGiftCategory(testDatabase.db);
    const gift = await seedGift(testDatabase.db, { categoryId: category.id });
    await seedContribution(testDatabase.db, { giftId: gift.id, status: "cancelled" });

    const updated = await giftModule.updateGift(
      asUser("admin"),
      gift.id,
      buildGiftInput(category.id, { priceCents: gift.priceCents + 500 }),
    );

    expect(updated.priceCents).toBe(gift.priceCents + 500);
  });
});
