import { InvalidGiftImageError } from "@/modules/gifts/errors";
import type { Gift, GiftImage, GiftInput } from "@/modules/gifts/types";

export type ResolvedGiftImages = {
  uploadedImage: GiftImage | null;
  externalImageUrl: string | null;
};

export function currentImagesOf(gift: Gift | null): ResolvedGiftImages {
  const uploadedImage =
    gift?.imageUrl && gift.imagePublicId ? { url: gift.imageUrl, publicId: gift.imagePublicId } : null;
  return { uploadedImage, externalImageUrl: gift?.externalImageUrl ?? null };
}

export function resolveGiftImages(input: GiftInput, current: ResolvedGiftImages): ResolvedGiftImages {
  if (input.image && input.externalImageUrl) throw new InvalidGiftImageError();
  if (input.image) return { uploadedImage: input.image, externalImageUrl: null };
  if (input.externalImageUrl) return { uploadedImage: null, externalImageUrl: input.externalImageUrl };
  return {
    uploadedImage: input.image === undefined ? current.uploadedImage : null,
    externalImageUrl: input.externalImageUrl === undefined ? current.externalImageUrl : null,
  };
}
