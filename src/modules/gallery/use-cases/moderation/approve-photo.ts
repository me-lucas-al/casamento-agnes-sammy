import { requireRole } from "@/modules/auth/authorization";
import type { SessionUser } from "@/modules/auth/types";
import { approvedPhotosTag } from "@/shared/lib/cache/cache-tags";
import { PhotoNotFoundError } from "@/modules/gallery/errors";
import type { PhotoRepository } from "@/modules/gallery/repositories/contracts/photo-repository";

type Dependencies = { photoRepository: PhotoRepository };

export function makeApprovePhoto({ photoRepository }: Dependencies) {
  return async function approvePhoto(
    actor: SessionUser | null,
    photoId: string,
  ): Promise<{ changedTags: string[] }> {
    requireRole(actor, ["admin", "couple"]);
    const photo = await photoRepository.updateStatus(photoId, "approved");
    if (!photo) throw new PhotoNotFoundError();
    return { changedTags: [approvedPhotosTag()] };
  };
}
