import { requireRole } from "@/modules/auth/authorization";
import type { SessionUser } from "@/modules/auth/types";
import { GiftCategoryNotFoundError } from "@/modules/gifts/errors";
import { GIFT_MANAGER_ROLES } from "@/modules/gifts/lib/roles/gift-roles";
import { rejectDuplicateCategoryName } from "@/modules/gifts/lib/catalog/reject-duplicate-name";
import type { CategoryRepository } from "@/modules/gifts/repositories/contracts/category-repository";
import type { CategoryInput, GiftCategory } from "@/modules/gifts/types";

type Dependencies = { categoryRepository: CategoryRepository };

export function makeUpdateGiftCategory({ categoryRepository }: Dependencies) {
  return async function updateGiftCategory(
    actor: SessionUser | null,
    categoryId: string,
    input: CategoryInput,
  ): Promise<GiftCategory> {
    requireRole(actor, GIFT_MANAGER_ROLES);
    const existingCategory = await categoryRepository.findById(categoryId);
    if (!existingCategory) throw new GiftCategoryNotFoundError();
    return rejectDuplicateCategoryName(() => categoryRepository.update(categoryId, input));
  };
}
