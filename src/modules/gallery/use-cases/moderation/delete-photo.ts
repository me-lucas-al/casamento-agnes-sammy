import { requireRole } from "@/modules/auth/authorization";
import type { SessionUser } from "@/modules/auth/types";
import { approvedPhotosTag } from "@/shared/lib/cache/cache-tags";
import type { CloudinaryClient } from "@/shared/lib/cloudinary/cloudinary";
import { PhotoNotFoundError } from "@/modules/gallery/errors";
import { destroyUnsharedPhotoAsset } from "@/modules/gallery/lib/destroy-unshared-photo-asset";
import type { PhotoRepository } from "@/modules/gallery/repositories/contracts/photo-repository";

type Dependencies = { photoRepository: PhotoRepository; cloudinaryClient: CloudinaryClient };

export function makeDeletePhoto({ photoRepository, cloudinaryClient }: Dependencies) {
  return async function deletePhoto(
    actor: SessionUser | null,
    photoId: string,
  ): Promise<{ changedTags: string[] }> {
    requireRole(actor, ["admin", "couple"]);
    const photo = await photoRepository.findById(photoId);
    if (!photo) throw new PhotoNotFoundError();
    await photoRepository.deleteById(photoId);
    await destroyUnsharedPhotoAsset({ photoRepository, cloudinaryClient }, photo);
    return { changedTags: [approvedPhotosTag()] };
  };
}
