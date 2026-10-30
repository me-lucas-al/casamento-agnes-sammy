import { requireRole } from "@/modules/auth/authorization";
import type { SessionUser } from "@/modules/auth/types";
import { GiftCategoryNotFoundError } from "../errors";
import { GIFT_MANAGER_ROLES } from "../lib/gift-roles";
import type { CategoryRepository } from "../repositories/category-repository";
import type { CategoryInput, GiftCategory } from "../types";

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
    return categoryRepository.update(categoryId, input);
  };
}
