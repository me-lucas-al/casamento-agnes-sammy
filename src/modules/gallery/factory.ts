import { getDatabase } from "@/shared/db/client";
import type { Database } from "@/shared/db/types";
import { getServerEnv } from "@/shared/config/env";
import { nextCachedReader, type CachedReader } from "@/shared/lib/cache/cached-read";
import { createCloudinaryClient, type CloudinaryClient } from "@/shared/lib/cloudinary";
import { createDrizzlePhotoRepository } from "./repositories/drizzle-photo-repository";
import { makeApprovePhoto } from "./use-cases/approve-photo";
import { makeCountOwnPendingPhotos } from "./use-cases/count-own-pending-photos";
import { makeDeletePhoto } from "./use-cases/delete-photo";
import { makeListApprovedPhotosPage } from "./use-cases/list-approved-photos-page";
import { makeListPhotosPanelPage } from "./use-cases/list-photos-panel-page";
import { makeRegisterUploadedPhoto } from "./use-cases/register-uploaded-photo";
import { makeRejectPhoto } from "./use-cases/reject-photo";
import { makeSignUploadPhoto } from "./use-cases/sign-upload-photo";

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
    registerUploadedPhoto: makeRegisterUploadedPhoto({ photoRepository }),
    approvePhoto: makeApprovePhoto({ photoRepository }),
    rejectPhoto: makeRejectPhoto({ photoRepository, cloudinaryClient }),
    deletePhoto: makeDeletePhoto({ photoRepository, cloudinaryClient }),
    listApprovedPhotosPage: makeListApprovedPhotosPage({ photoRepository, cachedReader }),
    listPhotosPanelPage: makeListPhotosPanelPage({ photoRepository }),
    countOwnPendingPhotos: makeCountOwnPendingPhotos({ photoRepository }),
  };
}

export type GalleryModule = ReturnType<typeof createGalleryModule>;

export function getGalleryModule(): GalleryModule {
  const env = getServerEnv();
  const cloudinaryClient = createCloudinaryClient({
    cloudName: env.CLOUDINARY_CLOUD_NAME,
    apiKey: env.CLOUDINARY_API_KEY,
    apiSecret: env.CLOUDINARY_API_SECRET,
  });
  return createGalleryModule({ database: getDatabase(), cloudinaryClient, cachedReader: nextCachedReader });
}
