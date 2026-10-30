import { signGiftImageUploadAction } from "../controllers/gift-image.actions";
import type { GiftImage } from "../types";

export type UploadGiftImageResult = { ok: true; image: GiftImage } | { ok: false; error: string };

type CloudinaryUploadResponse = { secure_url?: string; public_id?: string };

export async function uploadGiftImage(file: File): Promise<UploadGiftImageResult> {
  const signed = await signGiftImageUploadAction({ contentType: file.type, sizeBytes: file.size });
  if (!signed.ok) return { ok: false, error: signed.error };
  const { cloudName, apiKey, timestamp, folder, signature } = signed.data;
  const body = new FormData();
  body.set("file", file);
  body.set("api_key", apiKey);
  body.set("timestamp", String(timestamp));
  body.set("folder", folder);
  body.set("signature", signature);
  const response = await fetch(`https://api.cloudinary.com/v1_1/${cloudName}/image/upload`, {
    method: "POST",
    body,
  });
  if (!response.ok) return { ok: false, error: "Falha ao enviar a imagem." };
  const uploaded: CloudinaryUploadResponse = await response.json();
  if (!uploaded.secure_url || !uploaded.public_id) return { ok: false, error: "Falha ao enviar a imagem." };
  return { ok: true, image: { url: uploaded.secure_url, publicId: uploaded.public_id } };
}
