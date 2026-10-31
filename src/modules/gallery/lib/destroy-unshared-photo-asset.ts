import type { CloudinaryClient } from "@/shared/lib/cloudinary";
import { destroyImageBestEffort } from "@/shared/lib/cloudinary-destroy";
import type { PhotoRepository } from "../repositories/contracts/photo-repository";
import type { Photo } from "../types";

type Dependencies = { photoRepository: PhotoRepository; cloudinaryClient: CloudinaryClient };

export async function destroyUnsharedPhotoAsset(
  { photoRepository, cloudinaryClient }: Dependencies,
  photo: Photo,
): Promise<void> {
  const isSharedWithAnotherPhoto = await photoRepository.existsWithPublicId(photo.cloudinaryPublicId, photo.id);
  if (isSharedWithAnotherPhoto) return;
  await destroyImageBestEffort(cloudinaryClient, photo.cloudinaryPublicId);
}
