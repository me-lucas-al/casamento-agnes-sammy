import { describe, expect, it } from "vitest";
import { asUser } from "@/tests/helpers/fake-session";
import { seedGift } from "@/tests/helpers/seeds/seed-gift";
import { useTestDatabase } from "@/tests/helpers/use-test-database";
import { createTestGiftModule } from "./gift-test-module";

describe("delete gift image cleanup", () => {
  const testDatabase = useTestDatabase();

  it("deletes the gift even when destroying the image fails", async () => {
    const { giftModule, cloudinaryClient } = createTestGiftModule(testDatabase.db);
    const gift = await seedGift(testDatabase.db, { imagePublicId: "gifts/delete-me", imageUrl: null });
    cloudinaryClient.failOnDestroy = true;

    await expect(giftModule.deleteGift(asUser("admin"), gift.id)).resolves.toBeUndefined();
    await expect(giftModule.getGiftForEdit(asUser("admin"), gift.id)).rejects.toThrow();
  });

  it("destroys the image of a deleted gift", async () => {
    const { giftModule, cloudinaryClient } = createTestGiftModule(testDatabase.db);
    const gift = await seedGift(testDatabase.db, { imagePublicId: "gifts/delete-me-too", imageUrl: null });

    await giftModule.deleteGift(asUser("couple"), gift.id);

    expect(cloudinaryClient.destroyedPublicIds).toContain("gifts/delete-me-too");
  });
});
