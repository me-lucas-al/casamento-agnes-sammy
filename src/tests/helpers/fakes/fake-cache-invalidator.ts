import type { CacheInvalidator } from "@/shared/lib/cache/invalidate";

export class FakeCacheInvalidator implements CacheInvalidator {
  invalidatedTags: string[] = [];
  invalidatedPaths: string[] = [];

  invalidateTags(tags: readonly string[]): void {
    this.invalidatedTags.push(...new Set(tags));
  }

  invalidatePath(path: string): void {
    this.invalidatedPaths.push(path);
  }

  reset(): void {
    this.invalidatedTags = [];
    this.invalidatedPaths = [];
  }
}
