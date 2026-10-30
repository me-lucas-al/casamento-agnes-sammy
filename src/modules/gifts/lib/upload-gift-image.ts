import { uploadSignedImage } from "@/shared/lib/cloudinary-upload";
import { signGiftImageUploadAction } from "../controllers/gift-image.actions";
import type { GiftImage } from "../types";

export type UploadGiftImageResult = { ok: true; image: GiftImage } | { ok: false; error: string };

const UPLOAD_FAILURE: UploadGiftImageResult = { ok: false, error: "Falha ao enviar a imagem." };

export async function uploadGiftImage(file: File): Promise<UploadGiftImageResult> {
  const signed = await signGiftImageUploadAction({ contentType: file.type, sizeBytes: file.size });
  if (!signed.ok) return { ok: false, error: signed.error };
  const uploaded = await uploadSignedImage(file, signed.data);
  if (!uploaded) return UPLOAD_FAILURE;
  return { ok: true, image: { url: uploaded.url, publicId: uploaded.publicId } };
}
