import { requireRole } from "@/modules/auth/authorization";
import type { SessionUser } from "@/modules/auth/types";
import { categoriesTag } from "@/shared/lib/cache/cache-tags";
import type { CachedReader } from "@/shared/lib/cache/cached-read";
import { GIFT_VIEWER_ROLES } from "@/modules/gifts/lib/roles/gift-roles";
import type { CategoryRepository } from "@/modules/gifts/repositories/contracts/category-repository";
import type { GiftCategory } from "@/modules/gifts/types";

type Dependencies = {
  categoryRepository: CategoryRepository;
  cachedReader: CachedReader;
};

export function makeListGiftCategories({ categoryRepository, cachedReader }: Dependencies) {
  return async function listGiftCategories(actor: SessionUser | null): Promise<GiftCategory[]> {
    requireRole(actor, GIFT_VIEWER_ROLES);
    return cachedReader.read(
      { keyParts: ["gift-categories"], tags: [categoriesTag()] },
      () => categoryRepository.list(),
    );
  };
}
