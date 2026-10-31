import { requireRole } from "@/modules/auth/authorization";
import type { SessionUser } from "@/modules/auth/types";
import { buildPageResult, type PageParams, type PageResult } from "@/shared/lib/pagination/pagination";
import type { PhotoRepository } from "@/modules/gallery/repositories/contracts/photo-repository";
import type { Photo, PhotoStatus } from "@/modules/gallery/types";

type Dependencies = { photoRepository: PhotoRepository };

type Input = PageParams & { status?: PhotoStatus };

export function makeListPhotosPanelPage({ photoRepository }: Dependencies) {
  return async function listPhotosPanelPage(
    actor: SessionUser | null,
    { page, perPage, offset, status }: Input,
  ): Promise<PageResult<Photo>> {
    requireRole(actor, ["admin", "couple"]);
    const { items, total } = await photoRepository.listPanelPage({ limit: perPage, offset, status });
    return buildPageResult({ items, total, page, perPage });
  };
}
