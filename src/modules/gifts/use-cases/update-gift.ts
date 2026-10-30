import { requireRole } from "@/modules/auth/authorization";
import type { SessionUser } from "@/modules/auth/types";
import type { CloudinaryClient } from "@/shared/lib/cloudinary";
import { destroyImageBestEffort } from "@/shared/lib/cloudinary-destroy";
import { GiftCategoryNotFoundError, GiftNotFoundError } from "../errors";
import { assertGiftImageOwnership } from "../lib/assert-gift-image-ownership";
import { rejectDuplicateGiftImage } from "../lib/reject-duplicate-gift-image";
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
  async function destroyReplacedImage(previousPublicId: string | null, giftId: string, nextPublicId: string | null) {
    if (!previousPublicId || previousPublicId === nextPublicId) return;
    if (await giftRepository.existsWithImagePublicId(previousPublicId, giftId)) return;
    await destroyImageBestEffort(cloudinaryClient, previousPublicId);
  }

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
    if (input.image && input.image.publicId !== existingGift.imagePublicId) {
      await assertGiftImageOwnership({ giftRepository, cloudinaryClient }, input.image, giftId);
    }
    const updatedGift = await rejectDuplicateGiftImage(() => giftRepository.update(giftId, draft));
    await destroyReplacedImage(existingGift.imagePublicId, giftId, draft.imagePublicId);
    return updatedGift;
  };
}
