import { GiftNotFoundError } from "@/modules/gifts/errors";
import type { GiftAvailability } from "@/modules/gifts/lib/availability/gift-availability";
import type { GiftRepository } from "@/modules/gifts/repositories/contracts/gift-repository";
import type { GetGiftsAvailability } from "./get-gifts-availability";

type Dependencies = {
  giftRepository: GiftRepository;
  getGiftsAvailability: GetGiftsAvailability;
};

export function makeGetGiftAvailability({ giftRepository, getGiftsAvailability }: Dependencies) {
  return async function getGiftAvailability(giftId: string): Promise<GiftAvailability> {
    const gift = await giftRepository.findById(giftId);
    if (!gift) throw new GiftNotFoundError();
    const availabilityByGiftId = await getGiftsAvailability([gift]);
    const availability = availabilityByGiftId.get(gift.id);
    if (!availability) throw new GiftNotFoundError();
    return availability;
  };
}
