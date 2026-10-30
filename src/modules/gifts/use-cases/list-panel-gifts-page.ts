import { requireRole } from "@/modules/auth/authorization";
import type { SessionUser } from "@/modules/auth/types";
import { buildPageResult, type PageResult } from "@/shared/lib/pagination";
import type { GiftAvailability } from "../lib/gift-availability";
import type { GiftListInput } from "../lib/gift-list-input";
import { GIFT_MANAGER_ROLES } from "../lib/gift-roles";
import type { GiftRepository } from "../repositories/gift-repository";
import type { GiftWithCategory } from "../types";
import type { GetGiftsAvailability } from "./get-gifts-availability";

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
    const { page, perPage, offset, search, categoryId, sort, band } = input;
    const { items: gifts, total } = await giftRepository.listPage({
      limit: perPage,
      offset,
      search,
      categoryId,
      sort,
      band,
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
