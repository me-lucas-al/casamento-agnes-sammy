import { describe, expect, it } from "vitest";
import { asUser } from "@/tests/helpers/fake-session";
import { seedGiftCategory } from "@/tests/helpers/seeds/seed-gift";
import { useTestDatabase } from "@/tests/helpers/use-test-database";
import { buildGiftInput, createTestGiftModule } from "./gift-test-module";

describe("gift image replacement", () => {
  const testDatabase = useTestDatabase();

  it("keeps the image when update omits it, replaces it destroying the old one, and removes it on null", async () => {
    const { giftModule, cloudinaryClient } = createTestGiftModule(testDatabase.db);
    const category = await seedGiftCategory(testDatabase.db);
    const admin = asUser("admin");
    const first = { url: "https://cdn.test/a.jpg", publicId: "gifts/a" };
    const second = { url: "https://cdn.test/b.jpg", publicId: "gifts/b" };
    const created = await giftModule.createGift(admin, buildGiftInput(category.id, { image: first }));

    const kept = await giftModule.updateGift(admin, created.id, buildGiftInput(category.id));
    expect(kept).toMatchObject({ imageUrl: first.url, imagePublicId: first.publicId });
    expect(cloudinaryClient.destroyedPublicIds).toEqual([]);

    const replaced = await giftModule.updateGift(admin, created.id, buildGiftInput(category.id, { image: second }));
    expect(replaced.imagePublicId).toBe("gifts/b");
    expect(cloudinaryClient.destroyedPublicIds).toEqual(["gifts/a"]);

    const removed = await giftModule.updateGift(admin, created.id, buildGiftInput(category.id, { image: null }));
    expect(removed).toMatchObject({ imageUrl: null, imagePublicId: null });
    expect(cloudinaryClient.destroyedPublicIds).toEqual(["gifts/a", "gifts/b"]);
  });
});
