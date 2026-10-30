import type { CloudinaryClient } from "./cloudinary";

export async function destroyImageBestEffort(
  cloudinaryClient: CloudinaryClient,
  publicId: string,
): Promise<void> {
  try {
    await cloudinaryClient.destroyImage(publicId);
  } catch {
    return;
  }
}
