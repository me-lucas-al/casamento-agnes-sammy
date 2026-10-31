import { requireRole } from "@/modules/auth/authorization";
import type { SessionUser } from "@/modules/auth/types";
import type { CloudinaryClient } from "@/shared/lib/cloudinary";
import { destroyImageBestEffort } from "@/shared/lib/cloudinary-destroy";
import {
  GiftHasActiveReservationsError,
  GiftHasConfirmedContributionError,
  GiftNotFoundError,
} from "@/modules/gifts/errors";
import { GIFT_MANAGER_ROLES } from "@/modules/gifts/lib/roles/gift-roles";
import type { GiftRepository } from "@/modules/gifts/repositories/contracts/gift-repository";

type Dependencies = {
  giftRepository: GiftRepository;
  cloudinaryClient: CloudinaryClient;
  now: () => Date;
};

export function makeDeleteGift({ giftRepository, cloudinaryClient, now }: Dependencies) {
  return async function deleteGift(actor: SessionUser | null, giftId: string): Promise<void> {
    requireRole(actor, GIFT_MANAGER_ROLES);
    const outcome = await giftRepository.deleteUnlessCommitted(giftId, now());
    if (outcome.status === "not_found") throw new GiftNotFoundError();
    if (outcome.status === "has_confirmed") throw new GiftHasConfirmedContributionError();
    if (outcome.status === "has_active_reservations") throw new GiftHasActiveReservationsError();
    const { imagePublicId } = outcome.gift;
    if (!imagePublicId) return;
    if (await giftRepository.existsWithImagePublicId(imagePublicId)) return;
    await destroyImageBestEffort(cloudinaryClient, imagePublicId);
  };
}
