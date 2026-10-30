import { createGalleryModule } from "@/modules/gallery/factory";
import { passThroughCachedReader } from "@/shared/lib/cache/cached-read";
import { FakeCloudinaryClient } from "@/tests/helpers/fake-cloudinary";
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

export function uploadInput(name: string) {
  return {
    cloudinaryPublicId: `gallery/${name}`,
    url: `https://res.cloudinary.com/demo/image/upload/v1/gallery/${name}.jpg`,
  };
}
