import { getDatabase } from "@/shared/db/client";
import type { Database } from "@/shared/db/types";
import { getCloudinaryEnv } from "@/shared/config/env";
import { nextCachedReader, type CachedReader } from "@/shared/lib/cache/cached-read";
import { createCloudinaryClient, type CloudinaryClient } from "@/shared/lib/cloudinary";
import { createDrizzleCategoryRepository } from "./repositories/drizzle/drizzle-category-repository";
import { createDrizzleGiftRepository } from "./repositories/drizzle/drizzle-gift-repository";
import { makeCreateGift } from "./use-cases/catalog/create-gift";
import { makeCreateGiftCategory } from "./use-cases/categories/create-gift-category";
import { makeDeleteGift } from "./use-cases/catalog/delete-gift";
import { makeDeleteGiftCategory } from "./use-cases/categories/delete-gift-category";
import { makeGetGiftAvailability } from "./use-cases/availability/get-gift-availability";
import { makeGetGiftForEdit } from "./use-cases/catalog/get-gift-for-edit";
import { makeGetGiftsAvailability } from "./use-cases/availability/get-gifts-availability";
import { makeListGiftCategories } from "./use-cases/categories/list-gift-categories";
import { makeListPanelGiftsPage } from "./use-cases/catalog/list-panel-gifts-page";
import { makeListVisibleGiftsPage } from "./use-cases/catalog/list-visible-gifts-page";
import { makeSignGiftImageUpload } from "./use-cases/images/sign-gift-image-upload";
import { makeUpdateGift } from "./use-cases/catalog/update-gift";
import { makeUpdateGiftCategory } from "./use-cases/categories/update-gift-category";

export type GiftModuleOptions = {
  now?: () => Date;
  cachedReader: CachedReader;
  cloudinaryClient: CloudinaryClient;
};

export function createGiftModule(database: Database, options: GiftModuleOptions) {
  const { now = () => new Date(), cachedReader, cloudinaryClient } = options;
  const giftRepository = createDrizzleGiftRepository(database);
  const categoryRepository = createDrizzleCategoryRepository(database);
  const getGiftsAvailability = makeGetGiftsAvailability({ giftRepository, now });
  return {
    giftRepository,
    categoryRepository,
    getGiftsAvailability,
    getGiftAvailability: makeGetGiftAvailability({ giftRepository, getGiftsAvailability }),
    createGiftCategory: makeCreateGiftCategory({ categoryRepository }),
    updateGiftCategory: makeUpdateGiftCategory({ categoryRepository }),
    deleteGiftCategory: makeDeleteGiftCategory({ categoryRepository }),
    listGiftCategories: makeListGiftCategories({ categoryRepository, cachedReader }),
    createGift: makeCreateGift({ giftRepository, categoryRepository, cloudinaryClient }),
    updateGift: makeUpdateGift({ giftRepository, categoryRepository, cloudinaryClient, now }),
    deleteGift: makeDeleteGift({ giftRepository, cloudinaryClient, now }),
    getGiftForEdit: makeGetGiftForEdit({ giftRepository }),
    listVisibleGiftsPage: makeListVisibleGiftsPage({ giftRepository, cachedReader, getGiftsAvailability }),
    listPanelGiftsPage: makeListPanelGiftsPage({ giftRepository, getGiftsAvailability }),
    signGiftImageUpload: makeSignGiftImageUpload({ cloudinaryClient }),
  };
}

export type GiftModule = ReturnType<typeof createGiftModule>;

export function getGiftModule(): GiftModule {
  const env = getCloudinaryEnv();
  return createGiftModule(getDatabase(), {
    cachedReader: nextCachedReader,
    cloudinaryClient: createCloudinaryClient({
      cloudName: env.CLOUDINARY_CLOUD_NAME,
      apiKey: env.CLOUDINARY_API_KEY,
      apiSecret: env.CLOUDINARY_API_SECRET,
      uploadPreset: env.CLOUDINARY_UPLOAD_PRESET,
    }),
  });
}
