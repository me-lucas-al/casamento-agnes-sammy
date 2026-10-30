import { GALLERY_FOLDER } from "./upload-rules";

const galleryPublicIdPattern = new RegExp(`^${GALLERY_FOLDER}/[A-Za-z0-9_-]+$`);

export function isGalleryPublicId(publicId: string): boolean {
  return galleryPublicIdPattern.test(publicId);
}

export function urlReferencesPublicId(url: string, publicId: string): boolean {
  if (!url.startsWith("https://")) return false;
  const path = url.split("?")[0] ?? "";
  return path.includes(`/${publicId}`);
}
