import { guestTag } from "@/shared/lib/cache/cache-tags";
import type { CacheInvalidator } from "@/shared/lib/cache/invalidate";

export function invalidateRsvpCache(invalidator: CacheInvalidator, guestId: string): void {
  invalidator.invalidateTags([guestTag(guestId)]);
  invalidator.invalidatePath("/confirmar-presenca");
  invalidator.invalidatePath("/painel");
}
