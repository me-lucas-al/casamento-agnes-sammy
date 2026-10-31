import { requireRole } from "@/modules/auth/authorization";
import type { SessionUser } from "@/modules/auth/types";
import type { CloudinaryClient } from "@/shared/lib/cloudinary";
import { destroyImageBestEffort } from "@/shared/lib/cloudinary-destroy";
import { GiftCategoryNotFoundError, GiftNotFoundError, GiftPricingLockedError } from "../errors";
import { assertGiftImageOwnership } from "../lib/assert-gift-image-ownership";
import { rejectDuplicateGiftName } from "../lib/reject-duplicate-name";
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
  now: () => Date;
};

export function makeUpdateGift({ giftRepository, categoryRepository, cloudinaryClient, now }: Dependencies) {
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
    const outcome = await rejectDuplicateGiftName(() =>
      rejectDuplicateGiftImage(() => giftRepository.updateUnlessPricingLocked(giftId, draft, now())),
    );
    if (outcome.status === "not_found") throw new GiftNotFoundError();
    if (outcome.status === "pricing_locked") throw new GiftPricingLockedError();
    await destroyReplacedImage(existingGift.imagePublicId, giftId, draft.imagePublicId);
    return outcome.gift;
  };
}
