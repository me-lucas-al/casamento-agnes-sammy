import { isManagedPublicId, urlReferencesCloudinaryAsset } from "@/shared/lib/cloudinary/cloudinary-url";
import { GALLERY_FOLDER } from "./upload-rules";

export function isGalleryPublicId(publicId: string): boolean {
  return isManagedPublicId(GALLERY_FOLDER, publicId);
}

export function urlReferencesPublicId(url: string, publicId: string, cloudName: string): boolean {
  return urlReferencesCloudinaryAsset({ url, publicId, cloudName });
}
