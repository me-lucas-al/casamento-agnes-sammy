import { describe, expect, it } from "vitest";
import { InvalidGiftImageError } from "@/modules/gifts/errors";
import { gifts } from "@/shared/db/schema";
import { buildManagedPublicId } from "@/shared/lib/cloudinary/cloudinary-url";
import { isUniqueViolation } from "@/shared/lib/errors/unique-violation";
import { FAKE_CLOUD_NAME } from "@/tests/helpers/fakes/fake-cloudinary";
import { asUser } from "@/tests/helpers/fakes/fake-session";
import { seedGift, seedGiftCategory } from "@/tests/helpers/database/seeds/seed-gift";
import { useTestDatabase } from "@/tests/helpers/database/use-test-database";
import { buildGiftInput, createTestGiftModule } from "../gift-test-module";

function buildImage() {
  const publicId = buildManagedPublicId("gifts");
  return { publicId, url: `https://res.cloudinary.com/${FAKE_CLOUD_NAME}/image/upload/v1/${publicId}.jpg` };
}

describe("unique gift image", () => {
  const testDatabase = useTestDatabase();

  it("rejects the same image created concurrently with the invalid image error", async () => {
    const { giftModule } = createTestGiftModule(testDatabase.db);
    const category = await seedGiftCategory(testDatabase.db);
    const admin = asUser("admin");
    const image = buildImage();

    const outcomes = await Promise.allSettled([
      giftModule.createGift(admin, buildGiftInput(category.id, { image })),
      giftModule.createGift(admin, buildGiftInput(category.id, { image })),
    ]);

    const rejected = outcomes.filter((outcome) => outcome.status === "rejected");
    expect(outcomes.filter((outcome) => outcome.status === "fulfilled")).toHaveLength(1);
    expect((rejected[0] as PromiseRejectedResult).reason).toBeInstanceOf(InvalidGiftImageError);
  });

  it("maps a race on update to the invalid image error", async () => {
    const { giftModule } = createTestGiftModule(testDatabase.db);
    const category = await seedGiftCategory(testDatabase.db);
    const admin = asUser("admin");
    const first = await giftModule.createGift(admin, buildGiftInput(category.id));
    const second = await giftModule.createGift(admin, buildGiftInput(category.id));
    const image = buildImage();

    const outcomes = await Promise.allSettled([
      giftModule.updateGift(admin, first.id, buildGiftInput(category.id, { image })),
      giftModule.updateGift(admin, second.id, buildGiftInput(category.id, { image })),
    ]);

    const rejected = outcomes.filter((outcome) => outcome.status === "rejected");
    expect(rejected).toHaveLength(1);
    expect((rejected[0] as PromiseRejectedResult).reason).toBeInstanceOf(InvalidGiftImageError);
  });

  it("allows many gifts without an image because NULLs never collide", async () => {
    await seedGift(testDatabase.db);
    await seedGift(testDatabase.db);
    await seedGift(testDatabase.db, { imagePublicId: null });
    expect(await testDatabase.db.select().from(gifts)).toHaveLength(3);
  });

  it("enforces the unique index at the database level", async () => {
    await seedGift(testDatabase.db, { imagePublicId: "gifts/shared" });

    await expect(seedGift(testDatabase.db, { imagePublicId: "gifts/shared" })).rejects.toSatisfy((error) =>
      isUniqueViolation(error),
    );
  });
});
