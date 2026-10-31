import { describe, expect, it } from "vitest";
import { ForbiddenError, UnauthenticatedError } from "@/modules/auth/errors";
import {
  GiftCategoryNotFoundError,
  GiftHasConfirmedContributionError,
  GiftNotFoundError,
  InvalidGiftConfigurationError,
} from "@/modules/gifts/errors";
import { asUser } from "@/tests/helpers/fakes/fake-session";
import { seedContribution } from "@/tests/helpers/database/seeds/seed-contribution";
import { seedGift, seedGiftCategory } from "@/tests/helpers/database/seeds/seed-gift";
import { useTestDatabase } from "@/tests/helpers/database/use-test-database";
import { buildGiftInput, createTestGiftModule } from "../gift-test-module";

describe("gift crud", () => {
  const testDatabase = useTestDatabase();
  const setup = () => createTestGiftModule(testDatabase.db);

  it.each(["admin", "couple"] as const)("lets %s create, update and read a gift", async (role) => {
    const { giftModule } = setup();
    const category = await seedGiftCategory(testDatabase.db);
    const actor = asUser(role);

    const created = await giftModule.createGift(actor, buildGiftInput(category.id));
    const updated = await giftModule.updateGift(
      actor,
      created.id,
      buildGiftInput(category.id, { name: "Panela de pressão", isVisible: false }),
    );

    expect(updated).toMatchObject({ name: "Panela de pressão", isVisible: false });
    expect((await giftModule.getGiftForEdit(actor, created.id)).id).toBe(created.id);
  });

  it("forbids guests and anonymous users from every write", async () => {
    const { giftModule } = setup();
    const gift = await seedGift(testDatabase.db);
    const input = buildGiftInput(gift.categoryId);
    const guest = asUser("guest");

    await expect(giftModule.createGift(guest, input)).rejects.toBeInstanceOf(ForbiddenError);
    await expect(giftModule.updateGift(guest, gift.id, input)).rejects.toBeInstanceOf(ForbiddenError);
    await expect(giftModule.deleteGift(guest, gift.id)).rejects.toBeInstanceOf(ForbiddenError);
    await expect(giftModule.getGiftForEdit(guest, gift.id)).rejects.toBeInstanceOf(ForbiddenError);
    await expect(giftModule.createGift(null, input)).rejects.toBeInstanceOf(UnauthenticatedError);
  });

  it("stores quota data for fixed_quotas and clears it for single", async () => {
    const { giftModule } = setup();
    const category = await seedGiftCategory(testDatabase.db);
    const admin = asUser("admin");

    const quotaGift = await giftModule.createGift(
      admin,
      buildGiftInput(category.id, { mode: "fixed_quotas", totalQuotas: 3, minAmountCents: 500 }),
    );
    const singleGift = await giftModule.createGift(
      admin,
      buildGiftInput(category.id, { mode: "single", totalQuotas: 3, minAmountCents: 500 }),
    );

    expect(quotaGift).toMatchObject({ totalQuotas: 3, minAmountCents: null });
    expect(singleGift).toMatchObject({ totalQuotas: null, minAmountCents: null });
  });

  it("stores minAmountCents for free_amount", async () => {
    const { giftModule } = setup();
    const category = await seedGiftCategory(testDatabase.db);

    const gift = await giftModule.createGift(
      asUser("couple"),
      buildGiftInput(category.id, { mode: "free_amount", kind: "experience", minAmountCents: 5000 }),
    );

    expect(gift).toMatchObject({ mode: "free_amount", kind: "experience", minAmountCents: 5000, totalQuotas: null });
  });

  it("rejects invalid mode configurations", async () => {
    const { giftModule } = setup();
    const category = await seedGiftCategory(testDatabase.db);
    const admin = asUser("admin");
    const invalidInputs = [
      buildGiftInput(category.id, { mode: "fixed_quotas" }),
      buildGiftInput(category.id, { mode: "fixed_quotas", totalQuotas: 1 }),
      buildGiftInput(category.id, { mode: "free_amount" }),
      buildGiftInput(category.id, { mode: "free_amount", minAmountCents: 999999 }),
      buildGiftInput(category.id, { priceCents: 0 }),
    ];

    for (const input of invalidInputs) {
      await expect(giftModule.createGift(admin, input)).rejects.toBeInstanceOf(InvalidGiftConfigurationError);
    }
  });

  it("requires an existing category and gift", async () => {
    const { giftModule } = setup();
    const admin = asUser("admin");
    const missingId = "00000000-0000-4000-8000-000000000000";
    const gift = await seedGift(testDatabase.db);

    await expect(giftModule.createGift(admin, buildGiftInput(missingId))).rejects.toBeInstanceOf(
      GiftCategoryNotFoundError,
    );
    await expect(giftModule.updateGift(admin, missingId, buildGiftInput(gift.categoryId))).rejects.toBeInstanceOf(
      GiftNotFoundError,
    );
    await expect(giftModule.deleteGift(admin, missingId)).rejects.toBeInstanceOf(GiftNotFoundError);
  });

  it("deletes a gift without confirmed contribution, its leftovers and its image", async () => {
    const { giftModule, cloudinaryClient } = setup();
    const gift = await seedGift(testDatabase.db, { imageUrl: "https://cdn.test/x.jpg", imagePublicId: "gifts/x" });
    await seedContribution(testDatabase.db, { giftId: gift.id, status: "cancelled" });

    await giftModule.deleteGift(asUser("couple"), gift.id);

    expect(await giftModule.giftRepository.findById(gift.id)).toBeNull();
    expect(cloudinaryClient.destroyedPublicIds).toEqual(["gifts/x"]);
  });

  it("refuses to delete a gift with a confirmed contribution but allows hiding it", async () => {
    const { giftModule } = setup();
    const gift = await seedGift(testDatabase.db);
    await seedContribution(testDatabase.db, { giftId: gift.id, status: "confirmed" });
    const admin = asUser("admin");

    await expect(giftModule.deleteGift(admin, gift.id)).rejects.toBeInstanceOf(GiftHasConfirmedContributionError);
    expect(await giftModule.giftRepository.hasConfirmedContribution(gift.id)).toBe(true);

    const hidden = await giftModule.updateGift(admin, gift.id, buildGiftInput(gift.categoryId, { isVisible: false }));
    expect(hidden.isVisible).toBe(false);
  });
});
