import { z } from "zod";
import { isManagedPublicId } from "@/shared/lib/cloudinary/cloudinary-url";
import { isAllowedImageUrl } from "@/shared/lib/images/image-host-rules";
import { GIFT_IMAGE_FOLDER } from "../lib/images/gift-image-rules";
import { isAllowedProductUrl, storeNameForProductUrl } from "../lib/product/product-link-rules";
import { GIFT_KINDS, GIFT_MODES } from "../types";

const optionalCents = z.number().int().nonnegative().nullish();

const imageSchema = z.object({
  url: z.url().max(500),
  publicId: z.string().max(300).refine((publicId) => isManagedPublicId(GIFT_IMAGE_FOLDER, publicId)),
});

const productUrlSchema = z.url().max(2000).refine(isAllowedProductUrl, "Loja não permitida");
const externalImageUrlSchema = z.url().max(2000).refine((url) => isAllowedImageUrl(url), "Host de imagem não permitido");

export const giftSchema = z
  .object({
    categoryId: z.uuid(),
    kind: z.enum(GIFT_KINDS),
    name: z.string().trim().min(2).max(120),
    description: z.string().trim().max(1000).default(""),
    priceCents: z.number().int().positive().max(100_000_000),
    mode: z.enum(GIFT_MODES),
    totalQuotas: z.number().int().positive().nullish(),
    minAmountCents: optionalCents,
    isVisible: z.boolean(),
    sortOrder: z.number().int().min(0).max(100_000).default(0),
    image: imageSchema.nullish(),
    productUrl: productUrlSchema.nullish(),
    externalImageUrl: externalImageUrlSchema.nullish(),
    storeName: z.string().trim().min(1).max(80).nullish(),
    priceCheckedAt: z.iso.date().nullish(),
})
  .refine((gift) => !(gift.image && gift.externalImageUrl), {
    path: ["externalImageUrl"],
    message: "Use foto enviada ou imagem externa, não as duas",
  })
  .refine(
    (gift) => !gift.storeName || !gift.productUrl || storeNameForProductUrl(gift.productUrl) === gift.storeName,
    { path: ["storeName"], message: "Loja não confere com o link" },
  );

export const giftIdSchema = z.uuid();

export type GiftSchemaInput = z.infer<typeof giftSchema>;
