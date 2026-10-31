import { invalidateGiftCaches } from "@/modules/gifts/lib/invalidate-gift-caches";
import { dashboardTag } from "@/shared/lib/cache/cache-tags";
import type { CacheInvalidator } from "@/shared/lib/cache/invalidate";

export const SUGGESTIONS_PATH = "/painel/presentes/sugestoes";

export function invalidateSuggestionCaches(invalidator: CacheInvalidator): void {
  invalidateGiftCaches(invalidator);
  invalidator.invalidateTags([dashboardTag()]);
  invalidator.invalidatePath(SUGGESTIONS_PATH);
}
