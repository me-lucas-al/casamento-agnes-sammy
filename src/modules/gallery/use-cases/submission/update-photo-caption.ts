import { requireRole } from "@/modules/auth/authorization";
import type { SessionUser } from "@/modules/auth/types";
import { approvedPhotosTag } from "@/shared/lib/cache/cache-tags";
import { PhotoNotFoundError } from "@/modules/gallery/errors";
import type { PhotoRepository } from "@/modules/gallery/repositories/contracts/photo-repository";
import type { Photo } from "@/modules/gallery/types";

type Dependencies = { photoRepository: PhotoRepository };

export function makeUpdatePhotoCaption({ photoRepository }: Dependencies) {
  return async function updatePhotoCaption(
    actor: SessionUser | null,
    photoId: string,
    caption: string | null,
  ): Promise<{ photo: Photo; changedTags: string[] }> {
    requireRole(actor, ["admin", "couple"]);
    const photo = await photoRepository.updateCaption(photoId, caption?.trim() || null);
    if (!photo) throw new PhotoNotFoundError();
    return { photo, changedTags: [approvedPhotosTag()] };
  };
}
