import { requireRole } from "@/modules/auth/authorization";
import type { SessionUser } from "@/modules/auth/types";
import { GiftCategoryInUseError, GiftCategoryNotFoundError } from "@/modules/gifts/errors";
import { GIFT_MANAGER_ROLES } from "@/modules/gifts/lib/roles/gift-roles";
import type { CategoryRepository } from "@/modules/gifts/repositories/contracts/category-repository";

type Dependencies = { categoryRepository: CategoryRepository };

export function makeDeleteGiftCategory({ categoryRepository }: Dependencies) {
  return async function deleteGiftCategory(actor: SessionUser | null, categoryId: string): Promise<void> {
    requireRole(actor, GIFT_MANAGER_ROLES);
    const existingCategory = await categoryRepository.findById(categoryId);
    if (!existingCategory) throw new GiftCategoryNotFoundError();
    if (await categoryRepository.hasGifts(categoryId)) throw new GiftCategoryInUseError();
    await categoryRepository.delete(categoryId);
  };
}
