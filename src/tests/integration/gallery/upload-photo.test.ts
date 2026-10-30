import { describe, expect, it } from "vitest";
import { ForbiddenError, UnauthenticatedError } from "@/modules/auth/errors";
import { InvalidPublicIdError, InvalidUploadError } from "@/modules/gallery/errors";
import { approvedPhotosTag } from "@/shared/lib/cache/cache-tags";
import { asUser } from "@/tests/helpers/fake-session";
import { seedAdmin } from "@/tests/helpers/seeds/seed-user";
import { seedGuest } from "@/tests/helpers/seeds/seed-guest";
import { useTestDatabase } from "@/tests/helpers/use-test-database";
import { buildGalleryContext, uploadInput } from "./gallery-test-context";

describe("photo upload", () => {
  const testDatabase = useTestDatabase();
  const context = () => buildGalleryContext(testDatabase.db);
  const validCandidate = { mimeType: "image/jpeg", sizeBytes: 1024 };

  it.each(["guest", "couple", "admin"] as const)("signs uploads for %s in the gallery folder", async (role) => {
    const signed = await context().galleryModule.signUploadPhoto(asUser(role), validCandidate);

    expect(signed.publicId.startsWith("gallery/")).toBe(true);
  });

  it("requires authentication to sign", async () => {
    await expect(context().galleryModule.signUploadPhoto(null, validCandidate)).rejects.toBeInstanceOf(
      UnauthenticatedError,
    );
  });

  it("rejects invalid mime and oversized files when signing", async () => {
    const { galleryModule } = context();

    await expect(
      galleryModule.signUploadPhoto(asUser("guest"), { mimeType: "image/gif", sizeBytes: 10 }),
    ).rejects.toBeInstanceOf(InvalidUploadError);
    await expect(
      galleryModule.signUploadPhoto(asUser("guest"), { mimeType: "image/png", sizeBytes: 9 * 1024 * 1024 }),
    ).rejects.toBeInstanceOf(InvalidUploadError);
  });

  it("stores guest uploads as pending without invalidating the cache", async () => {
    const guest = await seedGuest(testDatabase.db);

    const { photo, changedTags } = await context().galleryModule.registerUploadedPhoto(
      asUser("guest", { guestId: guest.id }),
      { ...uploadInput(), caption: "  Festa  " },
    );

    expect(photo).toMatchObject({ status: "pending", uploadedByGuestId: guest.id, caption: "Festa" });
    expect(changedTags).toEqual([]);
  });

  it.each(["couple", "admin"] as const)("approves %s uploads directly and invalidates approved tag", async (role) => {
    const user = await seedAdmin(testDatabase.db);

    const { photo, changedTags } = await context().galleryModule.registerUploadedPhoto(
      asUser(role, { id: user.id }),
      uploadInput(),
    );

    expect(photo).toMatchObject({ status: "approved", uploadedByUserId: user.id });
    expect(changedTags).toEqual([approvedPhotosTag()]);
  });

  it("rejects public ids outside the gallery folder and mismatching urls", async () => {
    const { galleryModule } = context();
    const actor = asUser("admin");

    await expect(
      galleryModule.registerUploadedPhoto(actor, { cloudinaryPublicId: "gifts/x", url: "https://a.com/gifts/x" }),
    ).rejects.toBeInstanceOf(InvalidPublicIdError);
    await expect(
      galleryModule.registerUploadedPhoto(actor, { ...uploadInput(), url: "https://a.com/other.jpg" }),
    ).rejects.toBeInstanceOf(InvalidPublicIdError);
  });

  it("forbids guest session without guest id", async () => {
    await expect(
      context().galleryModule.registerUploadedPhoto({ id: "x", role: "guest" }, uploadInput()),
    ).rejects.toBeInstanceOf(ForbiddenError);
  });
});
