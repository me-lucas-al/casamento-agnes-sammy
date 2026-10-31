import { requireRole } from "@/modules/auth/authorization";
import type { SessionUser } from "@/modules/auth/types";
import { categoriesTag, giftsTag } from "@/shared/lib/cache/cache-tags";
import type { CachedReader } from "@/shared/lib/cache/cached-read";
import { buildPageResult, type PageResult } from "@/shared/lib/pagination/pagination";
import type { GiftAvailability } from "@/modules/gifts/lib/availability/gift-availability";
import { buildGiftCacheKeyParts, type GiftListInput } from "@/modules/gifts/lib/listing/gift-list-input";
import { GIFT_VIEWER_ROLES } from "@/modules/gifts/lib/roles/gift-roles";
import { toPublicGift } from "@/modules/gifts/lib/catalog/to-public-gift";
import type { GiftRepository } from "@/modules/gifts/repositories/contracts/gift-repository";
import type { PublicGift } from "@/modules/gifts/types";
import type { GetGiftsAvailability } from "../availability/get-gifts-availability";

type Dependencies = {
  giftRepository: GiftRepository;
  cachedReader: CachedReader;
  getGiftsAvailability: GetGiftsAvailability;
};

export type PublicGiftListItem = PublicGift & { availability: GiftAvailability };

export function makeListVisibleGiftsPage({ giftRepository, cachedReader, getGiftsAvailability }: Dependencies) {
  return async function listVisibleGiftsPage(
    actor: SessionUser | null,
    input: GiftListInput,
  ): Promise<PageResult<PublicGiftListItem>> {
    requireRole(actor, GIFT_VIEWER_ROLES);
    const { page, perPage, offset, search, categoryId, sort, band } = input;
    const cachedPage = await cachedReader.read(
      { keyParts: buildGiftCacheKeyParts(input), tags: [giftsTag(), categoriesTag()] },
      async () => {
        const { items, total } = await giftRepository.listPage({
          limit: perPage,
          offset,
          search,
          categoryId,
          sort,
          band,
          onlyVisible: true,
        });
        return { items: items.map(toPublicGift), total };
      },
    );
    const availabilityByGiftId = await getGiftsAvailability(cachedPage.items);
    const items = cachedPage.items.flatMap((gift) => {
      const availability = availabilityByGiftId.get(gift.id);
      return availability ? [{ ...gift, availability }] : [];
    });
    return buildPageResult({ items, total: cachedPage.total, page, perPage });
  };
}
