import { describe, expect, it } from "vitest";
import { GiftCategoryNameTakenError, GiftNameTakenError } from "@/modules/gifts/errors";
import { asUser } from "@/tests/helpers/fake-session";
import { seedGift, seedGiftCategory } from "@/tests/helpers/seeds/seed-gift";
import { useTestDatabase } from "@/tests/helpers/use-test-database";
import { buildGiftInput, createTestGiftModule } from "./gift-test-module";

describe("unique gift and category names", () => {
  const testDatabase = useTestDatabase();
  const couple = asUser("couple");

  it("rejects a gift whose name only differs by case", async () => {
    const { giftModule } = createTestGiftModule(testDatabase.db);
    const category = await seedGiftCategory(testDatabase.db);
    await seedGift(testDatabase.db, { categoryId: category.id, name: "Air Fryer" });

    await expect(
      giftModule.createGift(couple, buildGiftInput(category.id, { name: "air fryer" })),
    ).rejects.toBeInstanceOf(GiftNameTakenError);
  });

  it("rejects renaming a gift to an existing name", async () => {
    const { giftModule } = createTestGiftModule(testDatabase.db);
    const category = await seedGiftCategory(testDatabase.db);
    await seedGift(testDatabase.db, { categoryId: category.id, name: "Panela" });
    const other = await seedGift(testDatabase.db, { categoryId: category.id, name: "Faqueiro" });

    await expect(
      giftModule.updateGift(couple, other.id, buildGiftInput(category.id, { name: "PANELA" })),
    ).rejects.toBeInstanceOf(GiftNameTakenError);
  });

  it("rejects duplicate category names on create and update", async () => {
    const { giftModule } = createTestGiftModule(testDatabase.db);
    await seedGiftCategory(testDatabase.db, { name: "Cozinha" });
    const other = await seedGiftCategory(testDatabase.db, { name: "Sala" });

    await expect(giftModule.createGiftCategory(couple, { name: "cozinha", sortOrder: 1 })).rejects.toBeInstanceOf(
      GiftCategoryNameTakenError,
    );
    await expect(giftModule.updateGiftCategory(couple, other.id, { name: "COZINHA", sortOrder: 1 })).rejects.toBeInstanceOf(
      GiftCategoryNameTakenError,
    );
  });
});
