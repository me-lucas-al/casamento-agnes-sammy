import { parseBrlToCents } from "@/shared/lib/money/money";
import type { Gift, GiftImage, GiftKind, GiftMode } from "@/modules/gifts/types";

export type GiftFormValues = {
  categoryId: string;
  kind: GiftKind;
  name: string;
  description: string;
  price: string;
  mode: GiftMode;
  totalQuotas: string;
  minAmount: string;
  isVisible: boolean;
  sortOrder: string;
  productUrl: string;
  externalImageUrl: string;
  priceCheckedAt: string;
};

export type GiftPayloadResult =
  | { ok: true; payload: Record<string, unknown> }
  | { ok: false; error: string };

export function formatCentsForInput(cents: number | null): string {
  if (cents === null) return "";
  return (cents / 100).toFixed(2).replace(".", ",");
}

export function emptyGiftFormValues(categoryId: string): GiftFormValues {
  return {
    categoryId,
    kind: "item",
    name: "",
    description: "",
    price: "",
    mode: "single",
    totalQuotas: "",
    minAmount: "",
    isVisible: true,
    sortOrder: "0",
    productUrl: "",
    externalImageUrl: "",
    priceCheckedAt: "",
  };
}

export function giftToFormValues(gift: Gift): GiftFormValues {
  return {
    categoryId: gift.categoryId,
    kind: gift.kind,
    name: gift.name,
    description: gift.description,
    price: formatCentsForInput(gift.priceCents),
    mode: gift.mode,
    totalQuotas: gift.totalQuotas === null ? "" : String(gift.totalQuotas),
    minAmount: formatCentsForInput(gift.minAmountCents),
    isVisible: gift.isVisible,
    sortOrder: String(gift.sortOrder),
    productUrl: gift.productUrl ?? "",
    externalImageUrl: gift.externalImageUrl ?? "",
    priceCheckedAt: gift.priceCheckedAt ?? "",
  };
}

export function buildGiftPayload(values: GiftFormValues, image: GiftImage | null | undefined): GiftPayloadResult {
  const priceCents = parseBrlToCents(values.price);
  if (priceCents === null) return { ok: false, error: "Informe um valor válido, como 150,00." };
  const minAmountCents = values.minAmount.trim() ? parseBrlToCents(values.minAmount) : null;
  if (values.mode === "free_amount" && minAmountCents === null) {
    return { ok: false, error: "Informe um valor mínimo válido." };
  }
  const totalQuotas = values.totalQuotas.trim() ? Number(values.totalQuotas) : null;
  return {
    ok: true,
    payload: {
      categoryId: values.categoryId,
      kind: values.kind,
      name: values.name,
      description: values.description,
      priceCents,
      mode: values.mode,
      totalQuotas,
      minAmountCents,
      isVisible: values.isVisible,
      sortOrder: Number(values.sortOrder) || 0,
      image,
      productUrl: values.productUrl.trim() || null,
      priceCheckedAt: values.productUrl.trim() ? values.priceCheckedAt || null : null,
      ...(image ? {} : { externalImageUrl: values.externalImageUrl.trim() || null }),
    },
  };
}
