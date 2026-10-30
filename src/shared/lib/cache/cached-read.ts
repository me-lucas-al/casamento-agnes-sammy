import { unstable_cache } from "next/cache";

export type CachedReadOptions = {
  keyParts: string[];
  tags: string[];
  revalidateSeconds?: number;
};

export interface CachedReader {
  read<Result>(options: CachedReadOptions, load: () => Promise<Result>): Promise<Result>;
}

export const nextCachedReader: CachedReader = {
  read(options, load) {
    const cachedLoad = unstable_cache(load, options.keyParts, {
      tags: options.tags,
      revalidate: options.revalidateSeconds,
    });
    return cachedLoad();
  },
};

export const passThroughCachedReader: CachedReader = {
  read(_options, load) {
    return load();
  },
};
