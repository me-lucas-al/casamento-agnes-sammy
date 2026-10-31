import { requireRole } from "@/modules/auth/authorization";
import type { SessionUser } from "@/modules/auth/types";
import { buildPageResult, type PageResult } from "@/shared/lib/pagination/pagination";
import type { GiftAvailability } from "@/modules/gifts/lib/availability/gift-availability";
import type { GiftListInput } from "@/modules/gifts/lib/listing/gift-list-input";
import { GIFT_MANAGER_ROLES } from "@/modules/gifts/lib/roles/gift-roles";
import type { GiftRepository } from "@/modules/gifts/repositories/contracts/gift-repository";
import type { GiftWithCategory } from "@/modules/gifts/types";
import type { GetGiftsAvailability } from "../availability/get-gifts-availability";

type Dependencies = {
  giftRepository: GiftRepository;
  getGiftsAvailability: GetGiftsAvailability;
};

export type PanelGiftListItem = GiftWithCategory & { availability: GiftAvailability };

export function makeListPanelGiftsPage({ giftRepository, getGiftsAvailability }: Dependencies) {
  return async function listPanelGiftsPage(
    actor: SessionUser | null,
    input: GiftListInput,
  ): Promise<PageResult<PanelGiftListItem>> {
    requireRole(actor, GIFT_MANAGER_ROLES);
    const { page, perPage, offset, search, categoryId, sort, band, minPriceCents, maxPriceCents } = input;
    const { items: gifts, total } = await giftRepository.listPage({
      limit: perPage,
      offset,
      search,
      categoryId,
      sort,
      band,
      minPriceCents,
      maxPriceCents,
      onlyVisible: false,
    });
    const availabilityByGiftId = await getGiftsAvailability(gifts);
    const items = gifts.flatMap((gift) => {
      const availability = availabilityByGiftId.get(gift.id);
      return availability ? [{ ...gift, availability }] : [];
    });
    return buildPageResult({ items, total, page, perPage });
  };
}
