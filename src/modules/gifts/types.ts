import type { giftCategories, gifts } from "./schema";

export type Gift = typeof gifts.$inferSelect;
export type GiftCategory = typeof giftCategories.$inferSelect;
export type GiftMode = Gift["mode"];
export type GiftKind = Gift["kind"];

export const GIFT_MODES = ["single", "fixed_quotas", "free_amount"] as const satisfies readonly GiftMode[];
export const GIFT_KINDS = ["item", "experience"] as const satisfies readonly GiftKind[];

export type GiftImage = {
  url: string;
  publicId: string;
};

export type GiftInput = {
  categoryId: string;
  kind: GiftKind;
  name: string;
  description: string;
  priceCents: number;
  mode: GiftMode;
  totalQuotas?: number | null;
  minAmountCents?: number | null;
  isVisible: boolean;
  sortOrder: number;
  image?: GiftImage | null;
  productUrl?: string | null;
  externalImageUrl?: string | null;
  storeName?: string | null;
  priceCheckedAt?: string | null;
};

export type GiftDraft = {
  categoryId: string;
  kind: GiftKind;
  name: string;
  description: string;
  priceCents: number;
  mode: GiftMode;
  totalQuotas: number | null;
  minAmountCents: number | null;
  isVisible: boolean;
  sortOrder: number;
  imageUrl: string | null;
  imagePublicId: string | null;
  productUrl: string | null;
  externalImageUrl: string | null;
  storeName: string | null;
  priceCheckedAt: string | null;
};

export type CategoryInput = {
  name: string;
  sortOrder: number;
};

export type GiftWithCategory = Gift & { categoryName: string };

export type PublicGift = {
  id: string;
  name: string;
  description: string;
  imageUrl: string | null;
  productUrl: string | null;
  storeName: string | null;
  priceCents: number;
  mode: GiftMode;
  totalQuotas: number | null;
  minAmountCents: number | null;
};
