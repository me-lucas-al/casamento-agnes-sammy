import { approvedMessagesTag } from "@/shared/lib/cache/cache-tags";
import type { CacheInvalidator } from "@/shared/lib/cache/invalidate";

export function invalidateApprovedMessagesCache(invalidator: CacheInvalidator): void {
  invalidator.invalidateTags([approvedMessagesTag()]);
  invalidator.invalidatePath("/recados");
  invalidator.invalidatePath("/painel/recados");
}
