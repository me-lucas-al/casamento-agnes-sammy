import type { Gift } from "@/modules/gifts/types";

export function resolveGiftImageUrl(gift: Pick<Gift, "imageUrl" | "externalImageUrl">): string | null {
  return gift.imageUrl ?? gift.externalImageUrl ?? null;
}
