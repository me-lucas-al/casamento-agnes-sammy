import { STORE_NAME_BY_HOST } from "@/modules/gifts/lib/product/allowed-store-hosts";
import { hasTrackingParams, isAllowedProductUrl } from "@/modules/gifts/lib/product/product-link-rules";
import { isValidIsoDate } from "@/shared/lib/dates/iso-date";
import { isAllowedImageUrl } from "@/shared/lib/images/image-host-rules";
import { STORE_ID_BY_HOST } from "@/modules/gift-suggestions/data/stores";
import type { GiftSuggestion } from "@/modules/gift-suggestions/types";

const MIN_PRODUCT_QUOTAS = 2;
const MAX_PRODUCT_QUOTAS = 10;
const MAX_PRICE_CENTS = 100_000_000;


function describeLinkProblem(suggestion: GiftSuggestion, productUrl: string): string | null {
  if (!isAllowedProductUrl(productUrl)) return "product url must be https on an allowed store host";
  if (hasTrackingParams(productUrl)) return "product url has tracking params";
  const { hostname } = new URL(productUrl);
  if (suggestion.storeName !== STORE_NAME_BY_HOST[hostname]) return "store name does not match product url host";
  if (suggestion.store !== STORE_ID_BY_HOST[hostname]) return "store id does not match product url host";
  if (suggestion.storeSearchUrl !== null) return "product must not carry a search url";
  if (!suggestion.imageUrl || !isAllowedImageUrl(suggestion.imageUrl)) return "image url must be https on an allowed image host";
  return null;
}

function describeModeProblem({ mode, totalQuotas, minAmountCents }: GiftSuggestion): string | null {
  if (mode !== "single" && mode !== "fixed_quotas") return "product mode must be single or fixed quotas";
  if (minAmountCents !== undefined) return "product must not have a minimum";
  if (mode === "single") return totalQuotas === undefined ? null : "single mode takes no quotas";
  const validQuotas = totalQuotas !== undefined && totalQuotas >= MIN_PRODUCT_QUOTAS && totalQuotas <= MAX_PRODUCT_QUOTAS;
  return validQuotas ? null : "quota count out of range";
}

export function describeProductProblem(suggestion: GiftSuggestion): string | null {
  const { productUrl, priceCents, priceCheckedAt } = suggestion;
  if (!productUrl) return "missing product url";
  if (!Number.isInteger(priceCents) || priceCents < 1 || priceCents > MAX_PRICE_CENTS) return "price must be a positive integer";
  if (!isValidIsoDate(priceCheckedAt)) return "price checked date is invalid";
  return describeLinkProblem(suggestion, productUrl) ?? describeModeProblem(suggestion);
}

export function describeProductlessProblem(suggestion: GiftSuggestion): string | null {
  const { imageUrl, storeName, priceCheckedAt } = suggestion;
  const hasProductData = imageUrl !== null || storeName !== null || priceCheckedAt !== null;
  return hasProductData ? "image, store name and price date require a product url" : null;
}
