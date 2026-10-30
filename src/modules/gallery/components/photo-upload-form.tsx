"use client";

import { useRouter } from "next/navigation";
import { useState, type FormEvent } from "react";
import { registerUploadedPhotoAction, signUploadPhotoAction } from "../controllers/upload-photo.actions";
import { uploadToCloudinary } from "./upload-to-cloudinary";

const UPLOAD_ERROR = "Não foi possível enviar a foto. Tente novamente.";

export function PhotoUploadForm() {
  const router = useRouter();
  const [message, setMessage] = useState<string | null>(null);
  const [isSending, setIsSending] = useState(false);

  async function sendPhoto(file: File, caption: string): Promise<string> {
    const signed = await signUploadPhotoAction({ mimeType: file.type, sizeBytes: file.size });
    if (!signed.ok) return signed.error;
    const uploaded = await uploadToCloudinary(file, signed.data);
    if (!uploaded) return UPLOAD_ERROR;
    const registered = await registerUploadedPhotoAction({
      cloudinaryPublicId: uploaded.publicId,
      url: uploaded.url,
      caption,
    });
    if (!registered.ok) return registered.error;
    return registered.data.isPending ? "Foto enviada! Ela aparecerá após aprovação." : "Foto publicada!";
  }

  async function handleSubmit(event: FormEvent<HTMLFormElement>) {
    event.preventDefault();
    const form = event.currentTarget;
    const formData = new FormData(form);
    const file = formData.get("photo");
    if (!(file instanceof File) || file.size === 0) return setMessage("Escolha uma foto.");
    setIsSending(true);
    setMessage(await sendPhoto(file, String(formData.get("caption") ?? "")));
    setIsSending(false);
    form.reset();
    router.refresh();
  }

  return (
    <form onSubmit={handleSubmit} className="flex flex-col gap-3 rounded-xl bg-paper-dark p-4">
      <label className="flex flex-col gap-1 text-sm text-wine">
        Foto (JPG, PNG ou WEBP, até 8 MB)
        <input name="photo" type="file" accept="image/jpeg,image/png,image/webp" required />
      </label>
      <label className="flex flex-col gap-1 text-sm text-wine">
        Legenda (opcional)
        <input name="caption" maxLength={200} className="rounded-lg border bg-paper px-3 py-2" />
      </label>
      <button
        type="submit"
        disabled={isSending}
        className="rounded-full bg-rose px-4 py-2 text-white disabled:opacity-50"
      >
        {isSending ? "Enviando..." : "Enviar foto"}
      </button>
      {message ? <p role="status" className="text-sm text-wine">{message}</p> : null}
    </form>
  );
}
