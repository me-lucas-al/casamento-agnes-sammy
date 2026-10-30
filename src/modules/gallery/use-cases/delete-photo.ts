import { requireRole } from "@/modules/auth/authorization";
import type { SessionUser } from "@/modules/auth/types";
import { approvedPhotosTag } from "@/shared/lib/cache/cache-tags";
import type { CloudinaryClient } from "@/shared/lib/cloudinary";
import { PhotoNotFoundError } from "../errors";
import type { PhotoRepository } from "../repositories/photo-repository";

type Dependencies = { photoRepository: PhotoRepository; cloudinaryClient: CloudinaryClient };

export function makeDeletePhoto({ photoRepository, cloudinaryClient }: Dependencies) {
  return async function deletePhoto(
    actor: SessionUser | null,
    photoId: string,
  ): Promise<{ changedTags: string[] }> {
    requireRole(actor, ["admin", "couple"]);
    const photo = await photoRepository.findById(photoId);
    if (!photo) throw new PhotoNotFoundError();
    await cloudinaryClient.destroyImage(photo.cloudinaryPublicId);
    await photoRepository.deleteById(photoId);
    return { changedTags: [approvedPhotosTag()] };
  };
}
