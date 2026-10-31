import { InvalidGiftProductLinkError } from "@/modules/gifts/errors";
import { isAllowedImageUrl } from "@/shared/lib/images/image-host-rules";
import type { Gift, GiftDraft, GiftInput } from "@/modules/gifts/types";
import { currentImagesOf, resolveGiftImages } from "../images/resolve-gift-images";
import { normalizeGiftConfiguration } from "../pricing/gift-configuration";
import { isAllowedProductUrl, storeNameForProductUrl } from "../product/product-link-rules";

function resolveProductFields(input: GiftInput, current: Gift | null) {
  const productUrl = input.productUrl === undefined ? (current?.productUrl ?? null) : input.productUrl;
  const priceCheckedAt =
    input.priceCheckedAt === undefined ? (current?.priceCheckedAt ?? null) : input.priceCheckedAt;
  if (!productUrl) return { productUrl: null, storeName: null, priceCheckedAt: null };
  const storeName = storeNameForProductUrl(productUrl) ?? input.storeName ?? current?.storeName ?? null;
  return { productUrl, storeName, priceCheckedAt };
}

function assertAllowedLinks({ productUrl, externalImageUrl }: GiftInput) {
  if (productUrl && !isAllowedProductUrl(productUrl)) throw new InvalidGiftProductLinkError();
  if (externalImageUrl && !isAllowedImageUrl(externalImageUrl)) throw new InvalidGiftProductLinkError();
}

export function buildGiftDraft(input: GiftInput, currentGift: Gift | null): GiftDraft {
  assertAllowedLinks(input);
  const configuration = normalizeGiftConfiguration(input);
  const { uploadedImage, externalImageUrl } = resolveGiftImages(input, currentImagesOf(currentGift));
  return {
    categoryId: input.categoryId,
    kind: input.kind,
    name: input.name,
    description: input.description,
    ...configuration,
    isVisible: input.isVisible,
    sortOrder: input.sortOrder,
    imageUrl: uploadedImage?.url ?? null,
    imagePublicId: uploadedImage?.publicId ?? null,
    externalImageUrl,
    ...resolveProductFields(input, currentGift),
  };
}
