import { requireRole } from "@/modules/auth/authorization";
import type { SessionUser } from "@/modules/auth/types";
import { GIFT_MANAGER_ROLES } from "../lib/gift-roles";
import { rejectDuplicateCategoryName } from "../lib/reject-duplicate-name";
import type { CategoryRepository } from "../repositories/category-repository";
import type { CategoryInput, GiftCategory } from "../types";

type Dependencies = { categoryRepository: CategoryRepository };

export function makeCreateGiftCategory({ categoryRepository }: Dependencies) {
  return async function createGiftCategory(
    actor: SessionUser | null,
    input: CategoryInput,
  ): Promise<GiftCategory> {
    requireRole(actor, GIFT_MANAGER_ROLES);
    return rejectDuplicateCategoryName(() => categoryRepository.create(input));
  };
}
