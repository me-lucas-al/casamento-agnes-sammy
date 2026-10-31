import { storeNameForProductUrl } from "@/modules/gifts/lib/product/product-link-rules";
import { normalizeGiftName } from "../../lib/catalog/normalize-gift-name";
import type { GiftSuggestion, VerifiedProductRecord } from "../../types";
import { categoryNameOf, type SuggestionCategoryKey } from "../category-names";
import { PRODUCT_TYPE_LABELS } from "../product-types";
import { STORE_ID_BY_HOST } from "../stores";
import { bandOf } from "../suggestion-builders";

function tagsOf(record: VerifiedProductRecord): string[] {
  const words = normalizeGiftName(`${record.name} ${PRODUCT_TYPE_LABELS[record.type]}`).split(/[^a-z0-9]+/);
  return [...new Set(words.filter((word) => word.length > 2))];
}

function hydrateRecord(categoryKey: SuggestionCategoryKey, record: VerifiedProductRecord): GiftSuggestion {
  const { totalQuotas, checkedAt, ...fields } = record;
  return {
    ...fields,
    ...(totalQuotas === undefined ? {} : { totalQuotas }),
    categoryKey,
    categoryName: categoryNameOf(categoryKey),
    kind: "item",
    priceBand: bandOf(record.priceCents),
    store: STORE_ID_BY_HOST[new URL(record.productUrl).hostname] ?? null,
    storeSearchUrl: null,
    storeName: storeNameForProductUrl(record.productUrl),
    priceCheckedAt: checkedAt,
    tags: tagsOf(record),
  };
}

export function hydrateVerifiedProducts(
  categoryKey: SuggestionCategoryKey,
  records: readonly VerifiedProductRecord[],
): GiftSuggestion[] {
  return records.map((record) => hydrateRecord(categoryKey, record));
}
