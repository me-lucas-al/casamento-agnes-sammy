import { describe, expect, it } from "vitest";
import { ForbiddenError, UnauthenticatedError } from "@/modules/auth/errors";
import { PhotoNotFoundError } from "@/modules/gallery/errors";
import { approvedPhotosTag } from "@/shared/lib/cache/cache-tags";
import { asUser } from "@/tests/helpers/fake-session";
import { seedGuest } from "@/tests/helpers/seeds/seed-guest";
import { useTestDatabase } from "@/tests/helpers/use-test-database";
import { buildGalleryContext, uploadInput } from "./gallery-test-context";

describe("photo moderation", () => {
  const testDatabase = useTestDatabase();

  async function registerPendingPhoto(name: string) {
    const context = buildGalleryContext(testDatabase.db);
    const guest = await seedGuest(testDatabase.db);
    const { photo } = await context.galleryModule.registerUploadedPhoto(
      asUser("guest", { guestId: guest.id }),
      uploadInput(name),
    );
    return { ...context, photo, guest };
  }

  it.each(["couple", "admin"] as const)("lets %s approve and publishes the photo", async (role) => {
    const { galleryModule, photo } = await registerPendingPhoto("p1");

    const { changedTags } = await galleryModule.approvePhoto(asUser(role), photo.id);

    expect(changedTags).toEqual([approvedPhotosTag()]);
    const stored = await galleryModule.photoRepository.findById(photo.id);
    expect(stored?.status).toBe("approved");
  });

  it("forbids guests from moderating", async () => {
    const { galleryModule, photo } = await registerPendingPhoto("p2");
    const guest = asUser("guest");

    await expect(galleryModule.approvePhoto(guest, photo.id)).rejects.toBeInstanceOf(ForbiddenError);
    await expect(galleryModule.rejectPhoto(guest, photo.id)).rejects.toBeInstanceOf(ForbiddenError);
    await expect(galleryModule.deletePhoto(guest, photo.id)).rejects.toBeInstanceOf(ForbiddenError);
  });

  it.each(["couple", "admin"] as const)("lets %s update the caption", async (role) => {
    const { galleryModule, photo } = await registerPendingPhoto("c1");

    const { photo: updated, changedTags } = await galleryModule.updatePhotoCaption(
      asUser(role),
      photo.id,
      "  Nova legenda ",
    );

    expect(updated.caption).toBe("Nova legenda");
    expect(changedTags).toEqual([approvedPhotosTag()]);
  });

  it("forbids guests and anonymous from updating captions", async () => {
    const { galleryModule, photo } = await registerPendingPhoto("c2");

    await expect(galleryModule.updatePhotoCaption(asUser("guest"), photo.id, "x")).rejects.toBeInstanceOf(
      ForbiddenError,
    );
    await expect(galleryModule.updatePhotoCaption(null, photo.id, "x")).rejects.toBeInstanceOf(
      UnauthenticatedError,
    );
  });

  it("fails to update the caption of an unknown photo", async () => {
    const { galleryModule } = buildGalleryContext(testDatabase.db);

    await expect(
      galleryModule.updatePhotoCaption(asUser("admin"), "00000000-0000-4000-8000-000000000000", "x"),
    ).rejects.toBeInstanceOf(PhotoNotFoundError);
  });

  it("rejects a photo destroying the remote image and keeping it unlisted", async () => {
    const { galleryModule, cloudinaryClient, photo } = await registerPendingPhoto("p3");

    const { changedTags } = await galleryModule.rejectPhoto(asUser("couple"), photo.id);

    expect(cloudinaryClient.destroyedPublicIds).toEqual(["gallery/p3"]);
    expect(changedTags).toEqual([approvedPhotosTag()]);
    expect((await galleryModule.photoRepository.findById(photo.id))?.status).toBe("rejected");
  });

  it("deletes a photo destroying the remote image", async () => {
    const { galleryModule, cloudinaryClient, photo } = await registerPendingPhoto("p4");

    await galleryModule.deletePhoto(asUser("admin"), photo.id);

    expect(cloudinaryClient.destroyedPublicIds).toEqual(["gallery/p4"]);
    expect(await galleryModule.photoRepository.findById(photo.id)).toBeNull();
  });

  it("fails on unknown photos without calling cloudinary", async () => {
    const { galleryModule, cloudinaryClient } = buildGalleryContext(testDatabase.db);
    const unknownId = "00000000-0000-4000-8000-000000000000";

    await expect(galleryModule.approvePhoto(asUser("admin"), unknownId)).rejects.toBeInstanceOf(PhotoNotFoundError);
    await expect(galleryModule.rejectPhoto(asUser("admin"), unknownId)).rejects.toBeInstanceOf(PhotoNotFoundError);
    await expect(galleryModule.deletePhoto(asUser("admin"), unknownId)).rejects.toBeInstanceOf(PhotoNotFoundError);
    expect(cloudinaryClient.destroyedPublicIds).toEqual([]);
  });
});
