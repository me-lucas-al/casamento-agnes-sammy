import type { CachedReadOptions, CachedReader } from "@/shared/lib/cache/cached-read";
import type { CacheInvalidator } from "@/shared/lib/cache/invalidate";

type CacheEntry = { tags: string[]; value: unknown };

export class InMemoryTaggedCache implements CachedReader, CacheInvalidator {
  private entries = new Map<string, CacheEntry>();
  readonly readKeys: string[][] = [];
  readonly readTags: string[][] = [];
  loadCount = 0;

  async read<Result>(options: CachedReadOptions, load: () => Promise<Result>): Promise<Result> {
    this.readKeys.push(options.keyParts);
    this.readTags.push(options.tags);
    const key = options.keyParts.join("|");
    const cached = this.entries.get(key);
    if (cached) return cached.value as Result;
    this.loadCount += 1;
    const value = await load();
    this.entries.set(key, { tags: options.tags, value });
    return value;
  }

  invalidateTags(tags: readonly string[]): void {
    for (const [key, entry] of this.entries) {
      if (entry.tags.some((tag) => tags.includes(tag))) this.entries.delete(key);
    }
  }

  invalidatePath(): void {}
}
