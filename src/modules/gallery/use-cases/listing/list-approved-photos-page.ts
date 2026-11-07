import { requireRole } from "@/modules/auth/authorization";
import { GUEST_AREA_READER_ROLES } from "@/modules/auth/role-groups";
import type { SessionUser } from "@/modules/auth/types";
import { approvedPhotosTag } from "@/shared/lib/cache/cache-tags";
import type { CachedReader } from "@/shared/lib/cache/cached-read";
import { buildPageResult, type PageParams, type PageResult } from "@/shared/lib/pagination/pagination";
import type { PhotoRepository } from "@/modules/gallery/repositories/contracts/photo-repository";
import type { PhotoSort, PublicPhoto } from "@/modules/gallery/types";

type Dependencies = { photoRepository: PhotoRepository; cachedReader: CachedReader };

type Input = PageParams & { sort: PhotoSort };

export function makeListApprovedPhotosPage({ photoRepository, cachedReader }: Dependencies) {
  return async function listApprovedPhotosPage(
    actor: SessionUser | null,
    { page, perPage, offset, sort }: Input,
  ): Promise<PageResult<PublicPhoto>> {
    requireRole(actor, GUEST_AREA_READER_ROLES);
    const { items, total } = await cachedReader.read(
      {
        keyParts: ["gallery", "approved", String(page), String(perPage), sort],
        tags: [approvedPhotosTag()],
      },
      () => photoRepository.listApprovedPage({ limit: perPage, offset, sort }),
    );
    return buildPageResult({ items, total, page, perPage });
  };
}
