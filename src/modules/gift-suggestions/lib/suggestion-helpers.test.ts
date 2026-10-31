import { describe, expect, it } from "vitest";
import { GIFT_SUGGESTION_CATALOG } from "../data/gift-suggestion-catalog";
import { SUGGESTION_CATEGORY_ORDER } from "../data/category-names";
import { filterSuggestions } from "./filter-suggestions";
import { groupSuggestionsByCategory } from "./group-suggestions";
import { normalizeGiftName } from "./normalize-gift-name";
import { parseSuggestionFilters } from "./suggestion-filters-params";

describe("normalizeGiftName", () => {
  it("removes accents, case and extra spaces", () => {
    expect(normalizeGiftName("  Cafeteira   ELÉTRICA ")).toBe("cafeteira eletrica");
  });
});

describe("groupSuggestionsByCategory", () => {
  it("groups in category order and skips empty categories", () => {
    const groups = groupSuggestionsByCategory(GIFT_SUGGESTION_CATALOG);
    expect(groups.map((group) => group.categoryName)).toEqual(SUGGESTION_CATEGORY_ORDER);
    const onlyFun = groupSuggestionsByCategory(GIFT_SUGGESTION_CATALOG.filter((s) => s.categoryName.startsWith("Divertidos")));
    expect(onlyFun).toHaveLength(1);
  });
});

describe("filterSuggestions", () => {
  it("filters by accent-insensitive search", () => {
    const result = filterSuggestions(GIFT_SUGGESTION_CATALOG, { search: "eletrica" });
    expect(result.map((suggestion) => suggestion.id)).toContain("cozinha-cafeteira");
  });

  it("filters by price band", () => {
    const result = filterSuggestions(GIFT_SUGGESTION_CATALOG, { search: "", band: "until-100" });
    expect(result.length).toBeGreaterThan(0);
    expect(result.every((suggestion) => suggestion.priceCents <= 10000)).toBe(true);
  });

  it("combines search and band", () => {
    const result = filterSuggestions(GIFT_SUGGESTION_CATALOG, { search: "fundo", band: "600-plus" });
    expect(result.every((suggestion) => suggestion.name.includes("Fundo"))).toBe(true);
  });
});

describe("parseSuggestionFilters", () => {
  it("accepts known bands and ignores unknown ones", () => {
    expect(parseSuggestionFilters({ search: " pizza ", band: "100-300" })).toEqual({ search: "pizza", band: "100-300" });
    expect(parseSuggestionFilters({ band: "abc" }).band).toBeUndefined();
  });
});
