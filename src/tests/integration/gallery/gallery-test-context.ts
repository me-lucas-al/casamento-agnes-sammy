import { createGalleryModule } from "@/modules/gallery/factory";
import { passThroughCachedReader } from "@/shared/lib/cache/cached-read";
import { buildManagedPublicId } from "@/shared/lib/cloudinary/cloudinary-url";
import { FAKE_CLOUD_NAME, FakeCloudinaryClient } from "@/tests/helpers/fake-cloudinary";
import type { Database } from "@/shared/db/types";

export function buildGalleryContext(database: Database) {
  const cloudinaryClient = new FakeCloudinaryClient();
  const galleryModule = createGalleryModule({
    database,
    cloudinaryClient,
    cachedReader: passThroughCachedReader,
  });
  return { cloudinaryClient, galleryModule };
}

export function uploadInput() {
  const cloudinaryPublicId = buildManagedPublicId("gallery");
  return {
    cloudinaryPublicId,
    url: `https://res.cloudinary.com/${FAKE_CLOUD_NAME}/image/upload/v1/${cloudinaryPublicId}.jpg`,
  };
}
