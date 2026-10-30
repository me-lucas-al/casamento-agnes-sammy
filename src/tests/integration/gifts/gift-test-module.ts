import { createGiftModule } from "@/modules/gifts/factory";
import type { GiftInput } from "@/modules/gifts/types";
import type { CachedReader } from "@/shared/lib/cache/cached-read";
import { passThroughCachedReader } from "@/shared/lib/cache/cached-read";
import type { Database } from "@/shared/db/types";
import { FakeCloudinaryClient } from "@/tests/helpers/fake-cloudinary";

type TestModuleOptions = {
  cachedReader?: CachedReader;
  now?: () => Date;
};

export function createTestGiftModule(db: Database, options: TestModuleOptions = {}) {
  const cloudinaryClient = new FakeCloudinaryClient();
  const giftModule = createGiftModule(db, {
    cachedReader: options.cachedReader ?? passThroughCachedReader,
    cloudinaryClient,
    now: options.now,
  });
  return { giftModule, cloudinaryClient };
}

export function buildGiftInput(categoryId: string, overrides: Partial<GiftInput> = {}): GiftInput {
  return {
    categoryId,
    kind: "item",
    name: "Jogo de panelas",
    description: "",
    priceCents: 30000,
    mode: "single",
    isVisible: true,
    sortOrder: 0,
    ...overrides,
  };
}

export const PAGE_ONE = { page: 1, perPage: 12, offset: 0 };
