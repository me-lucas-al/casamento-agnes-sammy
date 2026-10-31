import { getDatabase } from "@/shared/db/client";
import type { Database } from "@/shared/db/types";
import { getCloudinaryEnv } from "@/shared/config/env";
import { nextCachedReader, type CachedReader } from "@/shared/lib/cache/cached-read";
import { createCloudinaryClient, type CloudinaryClient } from "@/shared/lib/cloudinary/cloudinary";
import { createDrizzlePhotoRepository } from "./repositories/drizzle/drizzle-photo-repository";
import { makeApprovePhoto } from "./use-cases/moderation/approve-photo";
import { makeCountOwnPendingPhotos } from "./use-cases/listing/count-own-pending-photos";
import { makeDeletePhoto } from "./use-cases/moderation/delete-photo";
import { makeListApprovedPhotosPage } from "./use-cases/listing/list-approved-photos-page";
import { makeListPhotosPanelPage } from "./use-cases/listing/list-photos-panel-page";
import { makeRegisterUploadedPhoto } from "./use-cases/submission/register-uploaded-photo";
import { makeRejectPhoto } from "./use-cases/moderation/reject-photo";
import { makeSignUploadPhoto } from "./use-cases/submission/sign-upload-photo";
import { makeUpdatePhotoCaption } from "./use-cases/submission/update-photo-caption";

type GalleryModuleOptions = {
  database: Database;
  cloudinaryClient: CloudinaryClient;
  cachedReader: CachedReader;
};

export function createGalleryModule({ database, cloudinaryClient, cachedReader }: GalleryModuleOptions) {
  const photoRepository = createDrizzlePhotoRepository(database);
  return {
    photoRepository,
    signUploadPhoto: makeSignUploadPhoto({ cloudinaryClient }),
    registerUploadedPhoto: makeRegisterUploadedPhoto({ photoRepository, cloudinaryClient }),
    approvePhoto: makeApprovePhoto({ photoRepository }),
    updatePhotoCaption: makeUpdatePhotoCaption({ photoRepository }),
    rejectPhoto: makeRejectPhoto({ photoRepository, cloudinaryClient }),
    deletePhoto: makeDeletePhoto({ photoRepository, cloudinaryClient }),
    listApprovedPhotosPage: makeListApprovedPhotosPage({ photoRepository, cachedReader }),
    listPhotosPanelPage: makeListPhotosPanelPage({ photoRepository }),
    countOwnPendingPhotos: makeCountOwnPendingPhotos({ photoRepository }),
  };
}

export type GalleryModule = ReturnType<typeof createGalleryModule>;

export function getGalleryModule(): GalleryModule {
  const env = getCloudinaryEnv();
  const cloudinaryClient = createCloudinaryClient({
    cloudName: env.CLOUDINARY_CLOUD_NAME,
    apiKey: env.CLOUDINARY_API_KEY,
    apiSecret: env.CLOUDINARY_API_SECRET,
    uploadPreset: env.CLOUDINARY_UPLOAD_PRESET,
  });
  return createGalleryModule({ database: getDatabase(), cloudinaryClient, cachedReader: nextCachedReader });
}
