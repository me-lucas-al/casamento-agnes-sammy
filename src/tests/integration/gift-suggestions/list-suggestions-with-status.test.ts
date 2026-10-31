import { describe, expect, it } from "vitest";
import { GIFT_SUGGESTION_CATALOG } from "@/modules/gift-suggestions/data/gift-suggestion-catalog";
import { asUser } from "@/tests/helpers/fakes/fake-session";
import { seedGift } from "@/tests/helpers/database/seeds/seed-gift";
import { useTestDatabase } from "@/tests/helpers/database/use-test-database";
import { createTestSuggestionModule, idOf, queryOf, FIRST_PRODUCT_NAME } from "./gift-suggestion-test-module";

describe("listSuggestionsWithStatus", () => {
  const testDatabase = useTestDatabase();
  const couple = asUser("couple");
  const setup = () => createTestSuggestionModule(testDatabase.db).suggestionModule;

  it("marks suggestions already in the list by normalized name, including hidden gifts", async () => {
    await seedGift(testDatabase.db, { name: `  ${FIRST_PRODUCT_NAME.toLowerCase()} `, isVisible: false });

    const page = await setup().listSuggestionsWithStatus(couple, queryOf({ perPage: "48", q: FIRST_PRODUCT_NAME }));

    expect(page.items.filter((item) => item.alreadyInList).map((item) => item.id)).toEqual([idOf(FIRST_PRODUCT_NAME)]);
  });

  it("returns only the requested page with consistent totals", async () => {
    const suggestionModule = setup();

    const first = await suggestionModule.listSuggestionsWithStatus(couple, queryOf({ perPage: "24" }));
    const last = await suggestionModule.listSuggestionsWithStatus(couple, queryOf({ perPage: "24", page: String(first.totalPages) }));

    expect(first.items).toHaveLength(24);
    expect(first.total).toBe(GIFT_SUGGESTION_CATALOG.length);
    expect(first.totalPages).toBe(Math.ceil(GIFT_SUGGESTION_CATALOG.length / 24));
    expect(last.items).toHaveLength(GIFT_SUGGESTION_CATALOG.length - 24 * (first.totalPages - 1));
    expect(last.hasNextPage).toBe(false);
  });

  it("does not repeat items across consecutive pages", async () => {
    const suggestionModule = setup();

    const pageOne = await suggestionModule.listSuggestionsWithStatus(couple, queryOf({ sort: "a-z" }));
    const pageTwo = await suggestionModule.listSuggestionsWithStatus(couple, queryOf({ sort: "a-z", page: "2" }));

    const pageOneIds = new Set(pageOne.items.map((item) => item.id));
    expect(pageTwo.items.every((item) => !pageOneIds.has(item.id))).toBe(true);
  });

  it("combines filters and reports the filtered total", async () => {
    const target = GIFT_SUGGESTION_CATALOG.find((item) => item.name === FIRST_PRODUCT_NAME);
    const minCents = Math.floor((target?.priceCents ?? 0) / 100) * 100;
    const maxCents = minCents + 100;
    const page = await setup().listSuggestionsWithStatus(
      couple,
      queryOf({ categoria: "cozinha", loja: target?.store ?? "", precoMin: String(minCents / 100), precoMax: String(maxCents / 100) }),
    );

    expect(page.items.map((item) => item.id)).toContain(target?.id);
    expect(page.items.every((item) => item.store === target?.store && item.categoryKey === "cozinha")).toBe(true);
    expect(page.items.every((item) => item.priceCents >= minCents && item.priceCents <= maxCents)).toBe(true);
  });

  it("sorts by price in both directions", async () => {
    const suggestionModule = setup();

    const cheapest = await suggestionModule.listSuggestionsWithStatus(couple, queryOf({ sort: "menor-preco" }));
    const dearest = await suggestionModule.listSuggestionsWithStatus(couple, queryOf({ sort: "maior-preco" }));

    expect(cheapest.items[0].priceCents).toBe(Math.min(...GIFT_SUGGESTION_CATALOG.map((item) => item.priceCents)));
    expect(dearest.items[0].priceCents).toBe(Math.max(...GIFT_SUGGESTION_CATALOG.map((item) => item.priceCents)));
  });

  it("finds accented names with unaccented, mixed case search", async () => {
    const page = await setup().listSuggestionsWithStatus(couple, queryOf({ q: "COTAS DAS PASSAGENS AEREAS" }));

    expect(page.items.map((item) => item.name)).toContain("Cotas das passagens aéreas");
  });

  it("falls back to defaults on invalid params and ignores stores outside the list", async () => {
    const page = await setup().listSuggestionsWithStatus(
      couple,
      queryOf({ sort: "x", faixa: "x", categoria: "x", loja: "shopee", page: "abc", perPage: "999" }),
    );

    expect(page.total).toBe(GIFT_SUGGESTION_CATALOG.length);
    expect(page).toMatchObject({ page: 1, perPage: 12 });
  });

  it("filters by mode and price band", async () => {
    const suggestionModule = setup();

    const quotas = await suggestionModule.listSuggestionsWithStatus(couple, queryOf({ modo: "cotas", faixa: "600-plus", perPage: "48" }));

    expect(quotas.total).toBeGreaterThan(0);
    expect(quotas.items.every((item) => item.mode === "fixed_quotas" && item.priceCents > 60000)).toBe(true);
  });

  it("flips the status after adding", async () => {
    const suggestionModule = setup();

    await suggestionModule.addSuggestedGifts(couple, [idOf("Fundo livre da lua de mel")]);
    const page = await suggestionModule.listSuggestionsWithStatus(couple, queryOf({ q: "fundo livre da lua de mel" }));

    expect(page.items[0]).toMatchObject({ name: "Fundo livre da lua de mel", alreadyInList: true });
  });
});
