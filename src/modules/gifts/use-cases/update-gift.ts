import { requireRole } from "@/modules/auth/authorization";
import type { SessionUser } from "@/modules/auth/types";
import type { CloudinaryClient } from "@/shared/lib/cloudinary";
import { GiftCategoryNotFoundError, GiftNotFoundError } from "../errors";
import { buildGiftDraft, currentImageOf } from "../lib/gift-draft";
import { GIFT_MANAGER_ROLES } from "../lib/gift-roles";
import type { CategoryRepository } from "../repositories/category-repository";
import type { GiftRepository } from "../repositories/gift-repository";
import type { Gift, GiftInput } from "../types";

type Dependencies = {
  giftRepository: GiftRepository;
  categoryRepository: CategoryRepository;
  cloudinaryClient: CloudinaryClient;
};

export function makeUpdateGift({ giftRepository, categoryRepository, cloudinaryClient }: Dependencies) {
  return async function updateGift(
    actor: SessionUser | null,
    giftId: string,
    input: GiftInput,
  ): Promise<Gift> {
    requireRole(actor, GIFT_MANAGER_ROLES);
    const existingGift = await giftRepository.findById(giftId);
    if (!existingGift) throw new GiftNotFoundError();
    const draft = buildGiftDraft(input, currentImageOf(existingGift));
    const category = await categoryRepository.findById(draft.categoryId);
    if (!category) throw new GiftCategoryNotFoundError();
    const updatedGift = await giftRepository.update(giftId, draft);
    const previousPublicId = existingGift.imagePublicId;
    if (previousPublicId && previousPublicId !== draft.imagePublicId) {
      await cloudinaryClient.destroyImage(previousPublicId);
    }
    return updatedGift;
  };
}
