import { describe, expect, it } from "vitest";
import { InvalidPublicIdError } from "@/modules/gallery/errors";
import { photos } from "@/shared/db/schema";
import { isUniqueViolation } from "@/shared/lib/unique-violation";
import { asUser } from "@/tests/helpers/fake-session";
import { seedAdmin, seedCouple } from "@/tests/helpers/seeds/seed-user";
import { useTestDatabase } from "@/tests/helpers/use-test-database";
import { buildGalleryContext, uploadInput } from "./gallery-test-context";

describe("unique photo asset", () => {
  const testDatabase = useTestDatabase();

  async function staffActor(role: "admin" | "couple") {
    const user = role === "admin" ? await seedAdmin(testDatabase.db) : await seedCouple(testDatabase.db);
    return asUser(role, { id: user.id });
  }

  it("rejects the same asset registered concurrently with the invalid photo error", async () => {
    const { galleryModule } = buildGalleryContext(testDatabase.db);
    const input = uploadInput();
    const staff = await staffActor("admin");

    const outcomes = await Promise.allSettled([
      galleryModule.registerUploadedPhoto(staff, input),
      galleryModule.registerUploadedPhoto(staff, input),
    ]);

    const rejected = outcomes.filter((outcome) => outcome.status === "rejected");
    expect(outcomes.filter((outcome) => outcome.status === "fulfilled")).toHaveLength(1);
    expect(rejected).toHaveLength(1);
    expect((rejected[0] as PromiseRejectedResult).reason).toBeInstanceOf(InvalidPublicIdError);
  });

  it("rejects a second registration of an already stored asset", async () => {
    const { galleryModule } = buildGalleryContext(testDatabase.db);
    const input = uploadInput();
    await galleryModule.registerUploadedPhoto(await staffActor("admin"), input);

    await expect(galleryModule.registerUploadedPhoto(await staffActor("couple"), input)).rejects.toBeInstanceOf(
      InvalidPublicIdError,
    );
  });

  it("enforces the unique index at the database level", async () => {
    const values = { cloudinaryPublicId: "gallery/same", url: "https://example.com/a.jpg" };
    await testDatabase.db.insert(photos).values(values);

    const duplicate = testDatabase.db.insert(photos).values(values);

    await expect(duplicate).rejects.toSatisfy((error) => isUniqueViolation(error));
  });
});
