import type { SignedUploadParams } from "@/shared/lib/cloudinary";

type UploadedImage = { publicId: string; url: string };

export async function uploadToCloudinary(
  file: File,
  signed: SignedUploadParams,
): Promise<UploadedImage | null> {
  const body = new FormData();
  body.set("file", file);
  body.set("api_key", signed.apiKey);
  body.set("timestamp", String(signed.timestamp));
  body.set("folder", signed.folder);
  body.set("signature", signed.signature);
  const response = await fetch(`https://api.cloudinary.com/v1_1/${signed.cloudName}/image/upload`, {
    method: "POST",
    body,
  });
  if (!response.ok) return null;
  const uploaded: { public_id: string; secure_url: string } = await response.json();
  return { publicId: uploaded.public_id, url: uploaded.secure_url };
}
