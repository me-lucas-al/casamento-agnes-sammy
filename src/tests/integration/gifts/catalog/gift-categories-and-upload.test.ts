import { describe, expect, it } from "vitest";
import { ForbiddenError, UnauthenticatedError } from "@/modules/auth/errors";
import { GiftCategoryInUseError, GiftCategoryNotFoundError, InvalidImageUploadError } from "@/modules/gifts/errors";
import { MAX_IMAGE_SIZE_BYTES } from "@/modules/gifts/lib/images/image-upload-validator";
import { asUser } from "@/tests/helpers/fakes/fake-session";
import { seedGift, seedGiftCategory } from "@/tests/helpers/database/seeds/seed-gift";
import { useTestDatabase } from "@/tests/helpers/database/use-test-database";
import { createTestGiftModule } from "../gift-test-module";

describe("gift categories", () => {
  const testDatabase = useTestDatabase();
  const setup = () => createTestGiftModule(testDatabase.db).giftModule;

  it.each(["admin", "couple"] as const)("lets %s create, update, list ordered and delete", async (role) => {
    const giftModule = setup();
    const actor = asUser(role);

    const kitchen = await giftModule.createGiftCategory(actor, { name: "Cozinha", sortOrder: 2 });
    await giftModule.createGiftCategory(actor, { name: "Lua de mel", sortOrder: 1 });
    await giftModule.updateGiftCategory(actor, kitchen.id, { name: "Cozinha e mesa", sortOrder: 0 });

    const names = (await giftModule.listGiftCategories(actor)).map((category) => category.name);
    expect(names).toEqual(["Cozinha e mesa", "Lua de mel"]);

    await giftModule.deleteGiftCategory(actor, kitchen.id);
    expect(await giftModule.categoryRepository.findById(kitchen.id)).toBeNull();
  });

  it("lets guests read but not write categories", async () => {
    const giftModule = setup();
    const category = await seedGiftCategory(testDatabase.db);
    const guest = asUser("guest");

    expect(await giftModule.listGiftCategories(guest)).toHaveLength(1);
    await expect(giftModule.createGiftCategory(guest, { name: "X", sortOrder: 0 })).rejects.toBeInstanceOf(
      ForbiddenError,
    );
    await expect(giftModule.updateGiftCategory(guest, category.id, { name: "Y", sortOrder: 0 })).rejects.toBeInstanceOf(
      ForbiddenError,
    );
    await expect(giftModule.deleteGiftCategory(guest, category.id)).rejects.toBeInstanceOf(ForbiddenError);
    await expect(giftModule.listGiftCategories(null)).rejects.toBeInstanceOf(UnauthenticatedError);
  });

  it("refuses to delete a category that still has gifts and reports missing ones", async () => {
    const giftModule = setup();
    const gift = await seedGift(testDatabase.db);
    const admin = asUser("admin");

    await expect(giftModule.deleteGiftCategory(admin, gift.categoryId)).rejects.toBeInstanceOf(GiftCategoryInUseError);
    await expect(
      giftModule.deleteGiftCategory(admin, "00000000-0000-4000-8000-000000000000"),
    ).rejects.toBeInstanceOf(GiftCategoryNotFoundError);
  });
});

describe("gift image upload signing", () => {
  const testDatabase = useTestDatabase();
  const setup = () => createTestGiftModule(testDatabase.db).giftModule;

  it("signs valid uploads for admin and couple in the gifts folder", () => {
    const giftModule = setup();

    for (const role of ["admin", "couple"] as const) {
      const signed = giftModule.signGiftImageUpload(asUser(role), { contentType: "image/webp", sizeBytes: 2048 });
      expect(signed).toMatchObject({ signature: "fake-signature", allowedFormats: "jpg,png,webp" });
      expect(signed.publicId).toMatch(/^gifts\/[0-9a-f-]{36}$/);
    }
  });

  it("rejects wrong type, empty and oversized files", () => {
    const giftModule = setup();
    const admin = asUser("admin");

    for (const candidate of [
      { contentType: "image/gif", sizeBytes: 100 },
      { contentType: "image/png", sizeBytes: 0 },
      { contentType: "image/png", sizeBytes: MAX_IMAGE_SIZE_BYTES + 1 },
    ]) {
      expect(() => giftModule.signGiftImageUpload(admin, candidate)).toThrow(InvalidImageUploadError);
    }
  });

  it("forbids guests and anonymous users", () => {
    const giftModule = setup();
    const candidate = { contentType: "image/png", sizeBytes: 100 };

    expect(() => giftModule.signGiftImageUpload(asUser("guest"), candidate)).toThrow(ForbiddenError);
    expect(() => giftModule.signGiftImageUpload(null, candidate)).toThrow(UnauthenticatedError);
  });
});
