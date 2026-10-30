import {
  computeGiftAvailability,
  EMPTY_CONTRIBUTION_TOTALS,
  type GiftAvailability,
  type GiftPricing,
} from "../lib/gift-availability";
import type { GiftRepository } from "../repositories/gift-repository";

type Dependencies = {
  giftRepository: GiftRepository;
  now: () => Date;
};

export function makeGetGiftsAvailability({ giftRepository, now }: Dependencies) {
  return async function getGiftsAvailability(
    giftPricings: readonly GiftPricing[],
  ): Promise<Map<string, GiftAvailability>> {
    const giftIds = giftPricings.map((pricing) => pricing.id);
    const totalsByGiftId = await giftRepository.sumActiveContributions(giftIds, now());
    return new Map(
      giftPricings.map((pricing) => [
        pricing.id,
        computeGiftAvailability(pricing, totalsByGiftId.get(pricing.id) ?? EMPTY_CONTRIBUTION_TOTALS),
      ]),
    );
  };
}

export type GetGiftsAvailability = ReturnType<typeof makeGetGiftsAvailability>;
