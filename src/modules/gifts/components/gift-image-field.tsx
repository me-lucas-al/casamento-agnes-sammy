"use client";

import Image from "next/image";
import { useState, type ChangeEvent } from "react";
import { describeImageRejection } from "../errors";
import { validateImageUpload } from "../lib/image-upload-validator";
import { uploadGiftImage } from "../lib/upload-gift-image";
import type { GiftImage } from "../types";

type GiftImageFieldProps = {
  currentUrl: string | null;
  onImageChange: (image: GiftImage | null) => void;
};

export function GiftImageField({ currentUrl, onImageChange }: GiftImageFieldProps) {
  const [previewUrl, setPreviewUrl] = useState(currentUrl);
  const [isUploading, setIsUploading] = useState(false);
  const [errorMessage, setErrorMessage] = useState("");

  async function handleFileChange(event: ChangeEvent<HTMLInputElement>) {
    const file = event.target.files?.[0];
    if (!file) return;
    const validation = validateImageUpload({ contentType: file.type, sizeBytes: file.size });
    if (!validation.valid) return setErrorMessage(describeImageRejection(validation.reason));
    setErrorMessage("");
    setIsUploading(true);
    const result = await uploadGiftImage(file);
    setIsUploading(false);
    if (!result.ok) return setErrorMessage(result.error);
    setPreviewUrl(result.image.url);
    onImageChange(result.image);
  }

  function handleRemove() {
    setPreviewUrl(null);
    onImageChange(null);
  }

  return (
    <div className="flex flex-col gap-2 text-base font-medium text-wine">
      {previewUrl ? (
        <div className="relative aspect-square w-full max-w-xs overflow-hidden rounded-lg border border-gold/50">
          <Image src={previewUrl} alt="Pré-visualização" fill unoptimized className="object-cover" />
        </div>
      ) : null}
      <label className="flex min-h-11 flex-col gap-1">
        Imagem (JPG, PNG ou WebP, até 8 MB)
        <input
          type="file"
          accept="image/jpeg,image/png,image/webp"
          onChange={handleFileChange}
          disabled={isUploading}
          className="file:mr-3 file:min-h-11 file:cursor-pointer file:rounded-full file:border-0 file:bg-blush file:px-4 file:text-wine"
        />
      </label>
      {isUploading ? <span className="text-xs">Enviando...</span> : null}
      {previewUrl ? (
        <button type="button" onClick={handleRemove} className="self-start text-sm text-crimson underline">
          Remover imagem
        </button>
      ) : null}
      {errorMessage ? <p role="alert" className="text-xs text-crimson">{errorMessage}</p> : null}
    </div>
  );
}
