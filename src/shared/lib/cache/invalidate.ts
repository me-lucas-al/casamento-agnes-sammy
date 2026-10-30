import { revalidatePath, revalidateTag } from "next/cache";

export interface CacheInvalidator {
  invalidateTags(tags: readonly string[]): void;
  invalidatePath(path: string): void;
}

export const nextCacheInvalidator: CacheInvalidator = {
  invalidateTags(tags) {
    for (const tag of new Set(tags)) revalidateTag(tag, { expire: 0 });
  },
  invalidatePath(path) {
    revalidatePath(path);
  },
};
