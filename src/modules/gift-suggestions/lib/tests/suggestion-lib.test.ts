import { describe, expect, it } from "vitest";
import { GIFT_SUGGESTION_CATALOG } from "@/modules/gift-suggestions/data/gift-suggestion-catalog";
import { HONEYMOON_SUGGESTIONS } from "@/modules/gift-suggestions/data/honeymoon-suggestions";
import { NEW_HOME_FUNDS } from "@/modules/gift-suggestions/data/new-home-funds";
import { STORE_IDS } from "@/modules/gift-suggestions/data/stores";
import { parseSuggestionQuery } from "@/modules/gift-suggestions/schemas/suggestion-query-params";
import { buildStoreSearchUrl } from "../store/build-store-search-url";
import { normalizeGiftName } from "../catalog/normalize-gift-name";
import { selectSuggestions } from "../filters/query-suggestions";
import { serializeSuggestionQuery } from "../filters/serialize-suggestion-query";

const defaultFilters = parseSuggestionQuery({});

describe("normalizeGiftName", () => {
  it("removes accents, case and extra spaces", () => {
    expect(normalizeGiftName("  Cafeteira   ELÉTRICA ")).toBe("cafeteira eletrica");
  });
});

describe("buildStoreSearchUrl", () => {
  it("builds the documented search urls for the main stores", () => {
    expect(buildStoreSearchUrl("magazine-luiza", "Air fryer")).toBe("https://www.magazineluiza.com.br/busca/air+fryer/");
    expect(buildStoreSearchUrl("mercado-livre", "Air fryer")).toBe("https://lista.mercadolivre.com.br/air-fryer");
    expect(buildStoreSearchUrl("amazon-br", "Máquina de café")).toBe("https://www.amazon.com.br/s?k=maquina+de+cafe");
  });

  it("generates only https urls for every store", () => {
    for (const store of STORE_IDS) {
      expect(buildStoreSearchUrl(store, "Jogo de panelas").startsWith("https://")).toBe(true);
    }
  });
});

describe("parseSuggestionQuery", () => {
  it("falls back to defaults for invalid params", () => {
    const query = parseSuggestionQuery({
      sort: "x", faixa: "x", categoria: "x", tipo: "x", modo: "x", loja: "shopee,aliexpress",
      precoMin: "abc", precoMax: "-5", page: "-3", perPage: "7",
    });
    expect(query).toMatchObject({ sort: "relevancia", stores: [], page: 1, perPage: 12, q: "" });
    expect(query.band).toBeUndefined();
    expect(query.category).toBeUndefined();
    expect(query.type).toBeUndefined();
    expect(query.mode).toBeUndefined();
    expect(query.minPriceCents).toBeUndefined();
    expect(query.maxPriceCents).toBeUndefined();
  });

  it("keeps allowed stores from repeated or comma separated params and drops the rest", () => {
    expect(parseSuggestionQuery({ loja: ["amazon-br", "shopee"] }).stores).toEqual(["amazon-br"]);
    expect(parseSuggestionQuery({ loja: "kabum,magazine-luiza,temu" }).stores).toEqual(["kabum", "magazine-luiza"]);
  });

  it("converts reais to cents and orders an inverted range", () => {
    const query = parseSuggestionQuery({ precoMin: "300,50", precoMax: "100" });
    expect(query).toMatchObject({ minPriceCents: 10000, maxPriceCents: 30050 });
  });

  it("maps the mode param", () => {
    expect(parseSuggestionQuery({ modo: "cotas" }).mode).toBe("fixed_quotas");
    expect(parseSuggestionQuery({ modo: "livre" }).mode).toBe("free_amount");
    expect(parseSuggestionQuery({ modo: "item" }).mode).toBe("single");
  });

  it("round trips through serialization", () => {
    const original = parseSuggestionQuery({
      q: "panela", loja: "kabum,amazon-br", categoria: "cozinha", precoMin: "50,5", sort: "a-z", perPage: "24", page: "2",
    });
    const serialized = serializeSuggestionQuery(original);
    expect(parseSuggestionQuery(serialized as Record<string, string>)).toEqual(original);
  });
});

describe("selectSuggestions", () => {
  it("searches name, description and tags without accents or case", () => {
    const catalog = [HONEYMOON_SUGGESTIONS[0], ...NEW_HOME_FUNDS.slice(0, 2)];
    const [target] = catalog;
    const accented = target.name.toUpperCase();
    expect(selectSuggestions(catalog, { ...defaultFilters, q: accented }).map((suggestion) => suggestion.id)).toContain(target.id);
    const byTag = selectSuggestions(catalog, { ...defaultFilters, q: target.tags[0] });
    expect(byTag.map((suggestion) => suggestion.id)).toContain(target.id);
  });

  it("combines store, category, band and price range filters", () => {
    const result = selectSuggestions(GIFT_SUGGESTION_CATALOG, {
      ...defaultFilters, stores: ["amazon-br"], category: "cozinha", minPriceCents: 7000, maxPriceCents: 30000,
    });
    expect(result.length).toBeGreaterThan(0);
    for (const suggestion of result) {
      expect(suggestion).toMatchObject({ store: "amazon-br", categoryKey: "cozinha" });
      expect(suggestion.priceCents).toBeGreaterThanOrEqual(7000);
      expect(suggestion.priceCents).toBeLessThanOrEqual(30000);
    }
  });

  it("sorts by price and name", () => {
    const cheap = selectSuggestions(GIFT_SUGGESTION_CATALOG, { ...defaultFilters, sort: "menor-preco" });
    const expensive = selectSuggestions(GIFT_SUGGESTION_CATALOG, { ...defaultFilters, sort: "maior-preco" });
    const alphabetical = selectSuggestions(GIFT_SUGGESTION_CATALOG, { ...defaultFilters, sort: "a-z" });
    expect(cheap[0].priceCents).toBeLessThanOrEqual(cheap[1].priceCents);
    expect(expensive[0].priceCents).toBeGreaterThanOrEqual(expensive[1].priceCents);
    expect(alphabetical[0].name.localeCompare(alphabetical[1].name, "pt-BR")).toBeLessThanOrEqual(0);
  });

  it("ranks name matches first on relevance", () => {
    const result = selectSuggestions(GIFT_SUGGESTION_CATALOG, { ...defaultFilters, q: "tapete" });
    expect(result[0].name.toLowerCase()).toContain("tapete");
  });
});
