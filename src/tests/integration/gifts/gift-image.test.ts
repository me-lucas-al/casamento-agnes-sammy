import { describe, expect, it } from "vitest";
import { InvalidGiftImageError } from "@/modules/gifts/errors";
import { buildManagedPublicId } from "@/shared/lib/cloudinary-url";
import { FAKE_CLOUD_NAME } from "@/tests/helpers/fake-cloudinary";
import { asUser } from "@/tests/helpers/fake-session";
import { seedGiftCategory } from "@/tests/helpers/seeds/seed-gift";
import { useTestDatabase } from "@/tests/helpers/use-test-database";
import { buildGiftInput, createTestGiftModule } from "./gift-test-module";

function buildImage() {
  const publicId = buildManagedPublicId("gifts");
  return { publicId, url: `https://res.cloudinary.com/${FAKE_CLOUD_NAME}/image/upload/v1/${publicId}.jpg` };
}

describe("gift image replacement", () => {
  const testDatabase = useTestDatabase();

  it("keeps the image when update omits it, replaces it destroying the old one, and removes it on null", async () => {
    const { giftModule, cloudinaryClient } = createTestGiftModule(testDatabase.db);
    const category = await seedGiftCategory(testDatabase.db);
    const admin = asUser("admin");
    const first = buildImage();
    const second = buildImage();
    const created = await giftModule.createGift(admin, buildGiftInput(category.id, { image: first }));

    const kept = await giftModule.updateGift(admin, created.id, buildGiftInput(category.id));
    expect(kept).toMatchObject({ imageUrl: first.url, imagePublicId: first.publicId });
    expect(cloudinaryClient.destroyedPublicIds).toEqual([]);

    const replaced = await giftModule.updateGift(admin, created.id, buildGiftInput(category.id, { image: second }));
    expect(replaced.imagePublicId).toBe(second.publicId);
    expect(cloudinaryClient.destroyedPublicIds).toEqual([first.publicId]);

    const removed = await giftModule.updateGift(admin, created.id, buildGiftInput(category.id, { image: null }));
    expect(removed).toMatchObject({ imageUrl: null, imagePublicId: null });
    expect(cloudinaryClient.destroyedPublicIds).toEqual([first.publicId, second.publicId]);
  });

  it("keeps the update when destroying the old image fails", async () => {
    const { giftModule, cloudinaryClient } = createTestGiftModule(testDatabase.db);
    const category = await seedGiftCategory(testDatabase.db);
    const admin = asUser("admin");
    const created = await giftModule.createGift(admin, buildGiftInput(category.id, { image: buildImage() }));
    const replacement = buildImage();
    cloudinaryClient.failOnDestroy = true;

    const updated = await giftModule.updateGift(admin, created.id, buildGiftInput(category.id, { image: replacement }));

    expect(updated.imagePublicId).toBe(replacement.publicId);
  });
});

describe("gift image ownership", () => {
  const testDatabase = useTestDatabase();

  async function setup() {
    const context = createTestGiftModule(testDatabase.db);
    const category = await seedGiftCategory(testDatabase.db);
    return { ...context, category, admin: asUser("admin") };
  }

  it.each([
    ["foreign host", (id: string) => `https://evil.com/${FAKE_CLOUD_NAME}/image/upload/v1/${id}.jpg`],
    ["other cloud", (id: string) => `https://res.cloudinary.com/other/image/upload/v1/${id}.jpg`],
    ["mismatching asset", () => `https://res.cloudinary.com/${FAKE_CLOUD_NAME}/image/upload/v1/gifts/other.jpg`],
  ])("rejects a gift image with %s", async (_label, buildUrl) => {
    const { giftModule, category, admin } = await setup();
    const image = buildImage();

    await expect(
      giftModule.createGift(admin, buildGiftInput(category.id, { image: { ...image, url: buildUrl(image.publicId) } })),
    ).rejects.toBeInstanceOf(InvalidGiftImageError);
  });

  it("rejects an image already used by another gift on create and update", async () => {
    const { giftModule, category, admin } = await setup();
    const image = buildImage();
    await giftModule.createGift(admin, buildGiftInput(category.id, { image }));
    const other = await giftModule.createGift(admin, buildGiftInput(category.id));

    await expect(giftModule.createGift(admin, buildGiftInput(category.id, { image }))).rejects.toBeInstanceOf(
      InvalidGiftImageError,
    );
    await expect(
      giftModule.updateGift(admin, other.id, buildGiftInput(category.id, { image })),
    ).rejects.toBeInstanceOf(InvalidGiftImageError);
  });
});
