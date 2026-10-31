import { describe, expect, it } from "vitest";
import { DEFAULT_CATEGORIES } from "@/modules/gifts/lib/default-categories";
import { normalizeGiftConfiguration } from "@/modules/gifts/lib/gift-configuration";
import { SUGGESTION_CATEGORIES, SUGGESTION_CATEGORY_ORDER } from "../data/category-names";
import { GIFT_SUGGESTION_CATALOG } from "../data/gift-suggestion-catalog";
import { STORE_IDS } from "../data/stores";
import type { GiftSuggestion } from "../types";
import { validateCatalog } from "./validate-catalog";

const validQuota: GiftSuggestion = {
  id: "cozinha-teste",
  categoryKey: "cozinha",
  categoryName: "Cozinha & Eletrodomésticos",
  name: "Cota de teste",
  description: "Descrição.",
  kind: "item",
  mode: "fixed_quotas",
  type: "eletrodomestico",
  priceCents: 100000,
  totalQuotas: 10,
  priceBand: "600-plus",
  store: "magazine-luiza",
  storeSearchUrl: "https://www.magazineluiza.com.br/busca/teste/",
  tags: ["teste"],
};

describe("validateCatalog", () => {
  it("accepts the shipped catalog", () => {
    expect(validateCatalog(GIFT_SUGGESTION_CATALOG)).toEqual([]);
  });

  it("is large and balanced across the default categories", () => {
    expect(GIFT_SUGGESTION_CATALOG.length).toBeGreaterThanOrEqual(250);
    expect(SUGGESTION_CATEGORY_ORDER).toEqual(DEFAULT_CATEGORIES.map((category) => category.name));
    for (const { key } of SUGGESTION_CATEGORIES) {
      const count = GIFT_SUGGESTION_CATALOG.filter((suggestion) => suggestion.categoryKey === key).length;
      expect(count, key).toBeGreaterThanOrEqual(35);
    }
  });

  it("only references allowed stores and https search urls", () => {
    for (const suggestion of GIFT_SUGGESTION_CATALOG) {
      if (suggestion.store === null) continue;
      expect(STORE_IDS).toContain(suggestion.store);
      expect(suggestion.storeSearchUrl?.startsWith("https://")).toBe(true);
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
    expect(problems).toContain("duplicated id cozinha-teste");
    expect(problems).toContain("duplicated name cota de teste");
  });

  it("flags stores outside the allowed list and foreign hosts", () => {
    const unknownStore = { ...validQuota, id: "cozinha-a", name: "A", store: "shopee" } as unknown as GiftSuggestion;
    const foreignHost = { ...validQuota, id: "cozinha-b", name: "B", storeSearchUrl: "https://shopee.com.br/search?keyword=b" };
    const insecure = { ...validQuota, id: "cozinha-c", name: "C", storeSearchUrl: "http://www.magazineluiza.com.br/busca/c/" };
    const problems = validateCatalog([unknownStore, foreignHost, insecure]);
    expect(problems).toContain("cozinha-a: store not allowed");
    expect(problems).toContain("cozinha-b: invalid store search url");
    expect(problems).toContain("cozinha-c: invalid store search url");
  });

  it("requires a store for physical items", () => {
    const storeless = { ...validQuota, id: "cozinha-d", name: "D", store: null, storeSearchUrl: null };
    expect(validateCatalog([storeless])).toContain("cozinha-d: physical item needs a store");
  });

  it("flags quotas on single mode and minimum on fixed quotas", () => {
    const single = { ...validQuota, id: "cozinha-e", name: "E", mode: "single" as const };
    const withMinimum = { ...validQuota, id: "cozinha-f", name: "F", minAmountCents: 100 };
    const problems = validateCatalog([single, withMinimum]);
    expect(problems).toContain("cozinha-e: single mode takes no quotas or minimum");
    expect(problems).toContain("cozinha-f: fixed quotas must not have a minimum");
  });

  it("flags quota values that are not whole reais and wrong bands", () => {
    const uneven = { ...validQuota, id: "cozinha-g", name: "G", priceCents: 100500 };
    const wrongBand = { ...validQuota, id: "cozinha-h", name: "H", priceBand: "until-100" as const };
    const problems = validateCatalog([uneven, wrongBand]);
    expect(problems).toContain("cozinha-g: quota value must be a whole number of reais");
    expect(problems).toContain("cozinha-h: price band does not match price");
  });
});
