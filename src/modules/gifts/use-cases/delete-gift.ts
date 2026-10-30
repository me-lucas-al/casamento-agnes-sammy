import { requireRole } from "@/modules/auth/authorization";
import type { SessionUser } from "@/modules/auth/types";
import type { CloudinaryClient } from "@/shared/lib/cloudinary";
import { GiftHasConfirmedContributionError, GiftNotFoundError } from "../errors";
import { GIFT_MANAGER_ROLES } from "../lib/gift-roles";
import type { GiftRepository } from "../repositories/gift-repository";

type Dependencies = {
  giftRepository: GiftRepository;
  cloudinaryClient: CloudinaryClient;
};

export function makeDeleteGift({ giftRepository, cloudinaryClient }: Dependencies) {
  return async function deleteGift(actor: SessionUser | null, giftId: string): Promise<void> {
    requireRole(actor, GIFT_MANAGER_ROLES);
    const existingGift = await giftRepository.findById(giftId);
    if (!existingGift) throw new GiftNotFoundError();
    if (await giftRepository.hasConfirmedContribution(giftId)) {
      throw new GiftHasConfirmedContributionError();
    }
    await giftRepository.delete(giftId);
    if (existingGift.imagePublicId) await cloudinaryClient.destroyImage(existingGift.imagePublicId);
  };
}
