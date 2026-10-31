import { isPriceInBand, PRICE_BANDS } from "@/modules/gifts/lib/pricing/price-band";
import { categoryNameOf } from "@/modules/gift-suggestions/data/category-names";
import { PRODUCT_TYPE_LABELS, STORELESS_TYPES } from "@/modules/gift-suggestions/data/product-types";
import { isStoreId } from "@/modules/gift-suggestions/data/stores";
import type { GiftSuggestion } from "@/modules/gift-suggestions/types";
import { describeProductlessProblem, describeProductProblem } from "./describe-product-problem";
import { normalizeGiftName } from "./normalize-gift-name";
import { isAllowedStoreUrl } from "../store/is-allowed-store-url";

const MIN_QUOTAS = 2;
const MAX_QUOTAS = 1000;
const CENTS_PER_REAL = 100;
const FRIENDLY_PRICE_STEP_CENTS = 500;

function findDuplicates(values: string[]): string[] {
  const seen = new Set<string>();
  const duplicates: string[] = [];
  for (const value of values) {
    if (seen.has(value)) duplicates.push(value);
    seen.add(value);
  }
  return duplicates;
}

function describeConfigurationProblem(suggestion: GiftSuggestion): string | null {
  const { mode, totalQuotas, minAmountCents, priceCents } = suggestion;
  if (mode === "single" && (totalQuotas !== undefined || minAmountCents !== undefined)) return "single mode takes no quotas or minimum";
  if (mode === "fixed_quotas") {
    if (minAmountCents !== undefined) return "fixed quotas must not have a minimum";
    if (!totalQuotas || totalQuotas < MIN_QUOTAS || totalQuotas > MAX_QUOTAS) return "quota count out of range";
    if (priceCents % (totalQuotas * CENTS_PER_REAL) !== 0) return "quota value must be a whole number of reais";
  }
  if (mode === "free_amount") {
    if (totalQuotas !== undefined) return "free amount must not have quotas";
    if (!minAmountCents || minAmountCents < 1 || minAmountCents > priceCents) return "minimum out of range";
  }
  return null;
}

function describeStoreProblem(suggestion: GiftSuggestion): string | null {
  const { store, storeSearchUrl, kind, type } = suggestion;
  if (store === null) {
    if (storeSearchUrl !== null) return "search url without store";
    const mayHaveNoStore = kind === "experience" || STORELESS_TYPES.includes(type);
    return mayHaveNoStore ? null : "physical item needs a store";
  }
  if (!isStoreId(store)) return "store not allowed";
  if (!storeSearchUrl || !isAllowedStoreUrl(store, storeSearchUrl)) return "invalid store search url";
  return null;
}

function describeSuggestionProblem(suggestion: GiftSuggestion): string | null {
  if (categoryNameOf(suggestion.categoryKey) !== suggestion.categoryName) return "category name mismatch";
  if (!suggestion.id.startsWith(`${suggestion.categoryKey}-`)) return "id must start with category key";
  if (!suggestion.name.trim() || !suggestion.description.trim()) return "missing text";
  if (suggestion.tags.length === 0) return "missing search tags";
  if (!(suggestion.type in PRODUCT_TYPE_LABELS)) return "unknown product type";
  if (suggestion.productUrl) return describeProductProblem(suggestion) ?? describeBandProblem(suggestion);
  const productlessProblem = describeProductlessProblem(suggestion);
  if (productlessProblem) return productlessProblem;
  if (!Number.isInteger(suggestion.priceCents) || suggestion.priceCents % FRIENDLY_PRICE_STEP_CENTS !== 0) {
    return "price must be a friendly whole value";
  }
  return describeBandProblem(suggestion) ?? describeStoreProblem(suggestion) ?? describeConfigurationProblem(suggestion);
}

function describeBandProblem(suggestion: GiftSuggestion): string | null {
  const band = PRICE_BANDS.find((candidate) => candidate.id === suggestion.priceBand);
  if (!band || !isPriceInBand(suggestion.priceCents, band)) return "price band does not match price";
  return null;
}

export function validateCatalog(catalog: readonly GiftSuggestion[]): string[] {
  const duplicatedIds = findDuplicates(catalog.map((suggestion) => suggestion.id));
  const duplicatedUrls = findDuplicates(catalog.flatMap((suggestion) => (suggestion.productUrl ? [suggestion.productUrl] : [])));
  const duplicatedNames = findDuplicates(catalog.map((suggestion) => normalizeGiftName(suggestion.name)));
  const problems = catalog.flatMap((suggestion) => {
    const problem = describeSuggestionProblem(suggestion);
    return problem ? [`${suggestion.id}: ${problem}`] : [];
  });
  return [
    ...duplicatedIds.map((id) => `duplicated id ${id}`),
    ...duplicatedUrls.map((url) => `duplicated product url ${url}`),
    ...duplicatedNames.map((name) => `duplicated name ${name}`),
    ...problems,
  ];
}
