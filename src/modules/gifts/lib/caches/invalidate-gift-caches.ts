import { categoriesTag, giftsTag, giftTag } from "@/shared/lib/cache/cache-tags";
import type { CacheInvalidator } from "@/shared/lib/cache/invalidate";

export const PANEL_GIFTS_PATH = "/painel/presentes";
export const GUEST_GIFTS_PATH = "/presentes";

export function invalidateGiftCaches(invalidator: CacheInvalidator, giftId?: string): void {
  const giftSpecificTags = giftId ? [giftTag(giftId)] : [];
  invalidator.invalidateTags([giftsTag(), categoriesTag(), ...giftSpecificTags]);
  invalidator.invalidatePath(PANEL_GIFTS_PATH);
  invalidator.invalidatePath(GUEST_GIFTS_PATH);
}
