import { requireRole } from "@/modules/auth/authorization";
import type { SessionUser } from "@/modules/auth/types";
import type { CloudinaryClient } from "@/shared/lib/cloudinary/cloudinary";
import { GiftCategoryNotFoundError } from "@/modules/gifts/errors";
import { assertGiftImageOwnership } from "@/modules/gifts/lib/images/assert-gift-image-ownership";
import { rejectDuplicateGiftName } from "@/modules/gifts/lib/catalog/reject-duplicate-name";
import { rejectDuplicateGiftImage } from "@/modules/gifts/lib/images/reject-duplicate-gift-image";
import { buildGiftDraft } from "@/modules/gifts/lib/drafts/gift-draft";
import { GIFT_MANAGER_ROLES } from "@/modules/gifts/lib/roles/gift-roles";
import type { CategoryRepository } from "@/modules/gifts/repositories/contracts/category-repository";
import type { GiftRepository } from "@/modules/gifts/repositories/contracts/gift-repository";
import type { Gift, GiftInput } from "@/modules/gifts/types";

type Dependencies = {
  giftRepository: GiftRepository;
  categoryRepository: CategoryRepository;
  cloudinaryClient: CloudinaryClient;
};

export function makeCreateGift({ giftRepository, categoryRepository, cloudinaryClient }: Dependencies) {
  return async function createGift(actor: SessionUser | null, input: GiftInput): Promise<Gift> {
    requireRole(actor, GIFT_MANAGER_ROLES);
    const draft = buildGiftDraft(input, null);
    const category = await categoryRepository.findById(draft.categoryId);
    if (!category) throw new GiftCategoryNotFoundError();
    if (input.image) await assertGiftImageOwnership({ giftRepository, cloudinaryClient }, input.image);
    return rejectDuplicateGiftName(() => rejectDuplicateGiftImage(() => giftRepository.create(draft)));
  };
}
