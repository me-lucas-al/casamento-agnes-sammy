import { getDatabase } from "@/shared/db/client";
import type { Database } from "@/shared/db/types";
import { getServerEnv } from "@/shared/config/env";
import { nextCachedReader, type CachedReader } from "@/shared/lib/cache/cached-read";
import { createCloudinaryClient, type CloudinaryClient } from "@/shared/lib/cloudinary";
import { createDrizzleCategoryRepository } from "./repositories/drizzle-category-repository";
import { createDrizzleGiftRepository } from "./repositories/drizzle-gift-repository";
import { makeCreateGift } from "./use-cases/create-gift";
import { makeCreateGiftCategory } from "./use-cases/create-gift-category";
import { makeDeleteGift } from "./use-cases/delete-gift";
import { makeDeleteGiftCategory } from "./use-cases/delete-gift-category";
import { makeGetGiftAvailability } from "./use-cases/get-gift-availability";
import { makeGetGiftForEdit } from "./use-cases/get-gift-for-edit";
import { makeGetGiftsAvailability } from "./use-cases/get-gifts-availability";
import { makeListGiftCategories } from "./use-cases/list-gift-categories";
import { makeListPanelGiftsPage } from "./use-cases/list-panel-gifts-page";
import { makeListVisibleGiftsPage } from "./use-cases/list-visible-gifts-page";
import { makeSignGiftImageUpload } from "./use-cases/sign-gift-image-upload";
import { makeUpdateGift } from "./use-cases/update-gift";
import { makeUpdateGiftCategory } from "./use-cases/update-gift-category";

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
    updateGift: makeUpdateGift({ giftRepository, categoryRepository, cloudinaryClient }),
    deleteGift: makeDeleteGift({ giftRepository, cloudinaryClient, now }),
    getGiftForEdit: makeGetGiftForEdit({ giftRepository }),
    listVisibleGiftsPage: makeListVisibleGiftsPage({ giftRepository, cachedReader, getGiftsAvailability }),
    listPanelGiftsPage: makeListPanelGiftsPage({ giftRepository, getGiftsAvailability }),
    signGiftImageUpload: makeSignGiftImageUpload({ cloudinaryClient }),
  };
}

export type GiftModule = ReturnType<typeof createGiftModule>;

export function getGiftModule(): GiftModule {
  const env = getServerEnv();
  return createGiftModule(getDatabase(), {
    cachedReader: nextCachedReader,
    cloudinaryClient: createCloudinaryClient({
      cloudName: env.CLOUDINARY_CLOUD_NAME,
      apiKey: env.CLOUDINARY_API_KEY,
      apiSecret: env.CLOUDINARY_API_SECRET,
    }),
  });
}
