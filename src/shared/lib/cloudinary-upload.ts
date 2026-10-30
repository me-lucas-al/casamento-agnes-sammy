import type { SignedUploadParams } from "./cloudinary";

export type UploadedImage = { publicId: string; url: string };

type CloudinaryUploadResponse = { secure_url?: string; public_id?: string };

export async function uploadSignedImage(
  file: File,
  signed: SignedUploadParams,
): Promise<UploadedImage | null> {
  const body = new FormData();
  body.set("file", file);
  body.set("api_key", signed.apiKey);
  body.set("timestamp", String(signed.timestamp));
  body.set("public_id", signed.publicId);
  body.set("allowed_formats", signed.allowedFormats);
  body.set("upload_preset", signed.uploadPreset);
  body.set("signature", signed.signature);
  const response = await fetch(`https://api.cloudinary.com/v1_1/${signed.cloudName}/image/upload`, {
    method: "POST",
    body,
  });
  if (!response.ok) return null;
  const uploaded: CloudinaryUploadResponse = await response.json();
  if (!uploaded.secure_url || !uploaded.public_id) return null;
  return { publicId: uploaded.public_id, url: uploaded.secure_url };
}
