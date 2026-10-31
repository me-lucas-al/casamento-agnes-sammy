import { describe, expect, it } from "vitest";
import { parseGuestGiftListParams } from "../guest-gift-list-params";

describe("parseGuestGiftListParams", () => {
  it("reads q, price range, sort and page params", () => {
    const input = parseGuestGiftListParams({ q: " panela ", precoMin: "10,50", precoMax: "300", sort: "price-asc", page: "2", perPage: "24" });
    expect(input).toMatchObject({ search: "panela", minPriceCents: 1050, maxPriceCents: 30000, sort: "price-asc", page: 2, perPage: 24, offset: 24 });
  });

  it("swaps an inverted range and falls back for garbage", () => {
    expect(parseGuestGiftListParams({ precoMin: "500", precoMax: "100" })).toMatchObject({ minPriceCents: 10000, maxPriceCents: 50000 });
    expect(parseGuestGiftListParams({ precoMin: "abc", sort: "x" })).toMatchObject({ minPriceCents: undefined, sort: "order" });
  });

  it("ignores old category and band params", () => {
    const input = parseGuestGiftListParams({ categoria: "x", category: "y", faixa: "until-100", band: "until-100", search: "z" });
    expect(input.categoryId).toBeUndefined();
    expect(input.band).toBeUndefined();
    expect(input.search).toBe("");
  });
});
