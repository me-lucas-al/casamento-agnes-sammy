import type { Gift, GiftDraft, GiftImage, GiftInput } from "../types";
import { normalizeGiftConfiguration } from "./gift-configuration";

export function currentImageOf(gift: Gift): GiftImage | null {
  if (!gift.imageUrl || !gift.imagePublicId) return null;
  return { url: gift.imageUrl, publicId: gift.imagePublicId };
}

export function buildGiftDraft(input: GiftInput, currentImage: GiftImage | null): GiftDraft {
  const configuration = normalizeGiftConfiguration(input);
  const image = input.image === undefined ? currentImage : input.image;
  return {
    categoryId: input.categoryId,
    kind: input.kind,
    name: input.name,
    description: input.description,
    ...configuration,
    isVisible: input.isVisible,
    sortOrder: input.sortOrder,
    imageUrl: image?.url ?? null,
    imagePublicId: image?.publicId ?? null,
  };
}
