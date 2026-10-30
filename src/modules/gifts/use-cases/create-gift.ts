import { requireRole } from "@/modules/auth/authorization";
import type { SessionUser } from "@/modules/auth/types";
import { GiftCategoryNotFoundError } from "../errors";
import { buildGiftDraft } from "../lib/gift-draft";
import { GIFT_MANAGER_ROLES } from "../lib/gift-roles";
import type { CategoryRepository } from "../repositories/category-repository";
import type { GiftRepository } from "../repositories/gift-repository";
import type { Gift, GiftInput } from "../types";

type Dependencies = {
  giftRepository: GiftRepository;
  categoryRepository: CategoryRepository;
};

export function makeCreateGift({ giftRepository, categoryRepository }: Dependencies) {
  return async function createGift(actor: SessionUser | null, input: GiftInput): Promise<Gift> {
    requireRole(actor, GIFT_MANAGER_ROLES);
    const draft = buildGiftDraft(input, null);
    const category = await categoryRepository.findById(draft.categoryId);
    if (!category) throw new GiftCategoryNotFoundError();
    return giftRepository.create(draft);
  };
}
