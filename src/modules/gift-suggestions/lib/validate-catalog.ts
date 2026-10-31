import { isPriceInBand, PRICE_BANDS } from "@/modules/gifts/lib/price-band";
import { SUGGESTION_CATEGORY_ORDER } from "../data/category-names";
import type { GiftSuggestion } from "../types";
import { normalizeGiftName } from "./normalize-gift-name";

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

function describeSuggestionProblem(suggestion: GiftSuggestion): string | null {
  if (!SUGGESTION_CATEGORY_ORDER.includes(suggestion.categoryName)) return "unknown category";
  if (!suggestion.name.trim() || !suggestion.description.trim()) return "missing text";
  if (!Number.isInteger(suggestion.priceCents) || suggestion.priceCents % FRIENDLY_PRICE_STEP_CENTS !== 0) {
    return "price must be a friendly whole value";
  }
  const band = PRICE_BANDS.find((candidate) => candidate.id === suggestion.priceBand);
  if (!band || !isPriceInBand(suggestion.priceCents, band)) return "price band does not match price";
  return describeConfigurationProblem(suggestion);
}

export function validateCatalog(catalog: readonly GiftSuggestion[]): string[] {
  const duplicatedIds = findDuplicates(catalog.map((suggestion) => suggestion.id));
  const duplicatedNames = findDuplicates(catalog.map((suggestion) => normalizeGiftName(suggestion.name)));
  const problems = catalog.flatMap((suggestion) => {
    const problem = describeSuggestionProblem(suggestion);
    return problem ? [`${suggestion.id}: ${problem}`] : [];
  });
  return [
    ...duplicatedIds.map((id) => `duplicated id ${id}`),
    ...duplicatedNames.map((name) => `duplicated name ${name}`),
    ...problems,
  ];
}
