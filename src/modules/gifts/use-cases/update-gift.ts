import { requireRole } from "@/modules/auth/authorization";
import type { SessionUser } from "@/modules/auth/types";
import type { CloudinaryClient } from "@/shared/lib/cloudinary";
import { destroyImageBestEffort } from "@/shared/lib/cloudinary-destroy";
import { GiftCategoryNotFoundError, GiftNotFoundError, GiftPricingLockedError } from "../errors";
import { assertGiftImageOwnership } from "../lib/assert-gift-image-ownership";
import { rejectDuplicateGiftName } from "../lib/reject-duplicate-name";
import { rejectDuplicateGiftImage } from "../lib/reject-duplicate-gift-image";
import { buildGiftDraft, currentImageOf } from "../lib/gift-draft";
import { hasGiftPricingChanged } from "../lib/gift-pricing-changed";
import { GIFT_MANAGER_ROLES } from "../lib/gift-roles";
import type { CategoryRepository } from "../repositories/category-repository";
import type { GiftRepository } from "../repositories/gift-repository";
import type { Gift, GiftDraft, GiftInput } from "../types";

type Dependencies = {
  giftRepository: GiftRepository;
  categoryRepository: CategoryRepository;
  cloudinaryClient: CloudinaryClient;
  now: () => Date;
};

export function makeUpdateGift({ giftRepository, categoryRepository, cloudinaryClient, now }: Dependencies) {
  async function assertPricingUnlocked(existingGift: Gift, draft: GiftDraft) {
    if (!hasGiftPricingChanged(existingGift, draft)) return;
    const activeTotals = await giftRepository.sumActiveContributions([existingGift.id], now());
    if (activeTotals.has(existingGift.id)) throw new GiftPricingLockedError();
  }

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
    await assertPricingUnlocked(existingGift, draft);
    const category = await categoryRepository.findById(draft.categoryId);
    if (!category) throw new GiftCategoryNotFoundError();
    if (input.image && input.image.publicId !== existingGift.imagePublicId) {
      await assertGiftImageOwnership({ giftRepository, cloudinaryClient }, input.image, giftId);
    }
    const updatedGift = await rejectDuplicateGiftName(() =>
      rejectDuplicateGiftImage(() => giftRepository.update(giftId, draft)),
    );
    await destroyReplacedImage(existingGift.imagePublicId, giftId, draft.imagePublicId);
    return updatedGift;
  };
}
