import { describe, expect, it } from "vitest";
import { updateCaptionSchema } from "@/modules/gallery/schemas/gallery.schemas";
import { asUser } from "@/tests/helpers/fake-session";
import { seedGuest } from "@/tests/helpers/seeds/seed-guest";
import { useTestDatabase } from "@/tests/helpers/use-test-database";
import { buildGalleryContext, uploadInput } from "./gallery-test-context";

describe("photo caption editing", () => {
  const testDatabase = useTestDatabase();

  async function registerPhotoWithCaption() {
    const context = buildGalleryContext(testDatabase.db);
    const guest = await seedGuest(testDatabase.db);
    const { photo } = await context.galleryModule.registerUploadedPhoto(asUser("guest", { guestId: guest.id }), {
      ...uploadInput(),
      caption: "Antes",
    });
    return { ...context, photo };
  }

  it("clears the caption when the editor sends null", async () => {
    const { galleryModule, photo } = await registerPhotoWithCaption();

    const { photo: updated } = await galleryModule.updatePhotoCaption(asUser("couple"), photo.id, null);

    expect(updated.caption).toBeNull();
  });

  it("treats a blank caption as no caption", async () => {
    const { galleryModule, photo } = await registerPhotoWithCaption();

    const { photo: updated } = await galleryModule.updatePhotoCaption(asUser("admin"), photo.id, "   ");

    expect(updated.caption).toBeNull();
  });

  it("validates the editor payload before reaching the use-case", () => {
    const photoId = crypto.randomUUID();
    expect(updateCaptionSchema.safeParse({ photoId, caption: null }).success).toBe(true);
    expect(updateCaptionSchema.safeParse({ photoId, caption: "x".repeat(201) }).success).toBe(false);
    expect(updateCaptionSchema.safeParse({ photoId: "nope", caption: "ok" }).success).toBe(false);
  });
});
