import { requireRole } from "@/modules/auth/authorization";
import type { SessionUser } from "@/modules/auth/types";
import type { CloudinaryClient } from "@/shared/lib/cloudinary";
import { GiftCategoryNotFoundError } from "../errors";
import { assertGiftImageOwnership } from "../lib/assert-gift-image-ownership";
import { buildGiftDraft } from "../lib/gift-draft";
import { GIFT_MANAGER_ROLES } from "../lib/gift-roles";
import type { CategoryRepository } from "../repositories/category-repository";
import type { GiftRepository } from "../repositories/gift-repository";
import type { Gift, GiftInput } from "../types";

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
    return giftRepository.create(draft);
  };
}
