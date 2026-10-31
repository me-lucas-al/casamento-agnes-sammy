import { describe, expect, it } from "vitest";
import { DEFAULT_CATEGORIES } from "@/modules/gifts/lib/default-categories";
import { normalizeGiftConfiguration } from "@/modules/gifts/lib/gift-configuration";
import { GIFT_SUGGESTION_CATALOG } from "../data/gift-suggestion-catalog";
import { SUGGESTION_CATEGORY_ORDER } from "../data/category-names";
import type { GiftSuggestion } from "../types";
import { validateCatalog } from "./validate-catalog";

const validQuota: GiftSuggestion = {
  id: "teste-cota",
  categoryName: SUGGESTION_CATEGORY_ORDER[0],
  name: "Cota de teste",
  description: "Descrição.",
  kind: "item",
  mode: "fixed_quotas",
  priceCents: 100000,
  totalQuotas: 10,
  priceBand: "600-plus",
};

describe("validateCatalog", () => {
  it("accepts the shipped catalog", () => {
    expect(validateCatalog(GIFT_SUGGESTION_CATALOG)).toEqual([]);
  });

  it("covers exactly the default gift categories", () => {
    expect(SUGGESTION_CATEGORY_ORDER).toEqual(DEFAULT_CATEGORIES.map((category) => category.name));
    for (const categoryName of SUGGESTION_CATEGORY_ORDER) {
      const count = GIFT_SUGGESTION_CATALOG.filter((suggestion) => suggestion.categoryName === categoryName).length;
      expect(count).toBeGreaterThanOrEqual(12);
      expect(count).toBeLessThanOrEqual(20);
    }
  });

  it("produces configurations accepted by the gifts module rules", () => {
    for (const suggestion of GIFT_SUGGESTION_CATALOG) {
      expect(() => normalizeGiftConfiguration(suggestion), suggestion.id).not.toThrow();
    }
  });

  it("flags duplicated ids and names ignoring accents and case", () => {
    const duplicate = { ...validQuota, name: "COTA DE TESTE" };
    const problems = validateCatalog([validQuota, duplicate]);
    expect(problems).toContain("duplicated id teste-cota");
    expect(problems).toContain("duplicated name cota de teste");
  });

  it("flags quotas on single mode and minimum on fixed quotas", () => {
    const single = { ...validQuota, id: "a", name: "A", mode: "single" as const };
    const withMinimum = { ...validQuota, id: "b", name: "B", minAmountCents: 100 };
    const problems = validateCatalog([single, withMinimum]);
    expect(problems).toContain("a: single mode takes no quotas or minimum");
    expect(problems).toContain("b: fixed quotas must not have a minimum");
  });

  it("flags quota values that are not whole reais and wrong bands", () => {
    const uneven = { ...validQuota, id: "c", name: "C", priceCents: 100500 };
    const wrongBand = { ...validQuota, id: "d", name: "D", priceBand: "until-100" as const };
    const problems = validateCatalog([uneven, wrongBand]);
    expect(problems).toContain("c: quota value must be a whole number of reais");
    expect(problems).toContain("d: price band does not match price");
  });

  it("flags free amount without a valid minimum", () => {
    const fund: GiftSuggestion = {
      ...validQuota,
      id: "e",
      name: "E",
      mode: "free_amount",
      totalQuotas: undefined,
      minAmountCents: 200000,
    };
    expect(validateCatalog([fund])).toContain("e: minimum out of range");
  });
});
