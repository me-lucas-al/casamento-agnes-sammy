import { describe, expect, it } from "vitest";
import { findPriceBand, isPriceInBand, PRICE_BANDS, type PriceBandId } from "../price-band";

function bandOf(priceCents: number): PriceBandId | undefined {
  return PRICE_BANDS.find((band) => isPriceInBand(priceCents, band))?.id;
}

describe("price bands", () => {
  it.each([
    [1, "until-100"],
    [10000, "until-100"],
    [10001, "100-300"],
    [30000, "100-300"],
    [30001, "300-600"],
    [60000, "300-600"],
    [60001, "600-plus"],
    [5000000, "600-plus"],
  ] as const)("places %i cents in %s", (priceCents, expectedBand) => {
    expect(bandOf(priceCents)).toBe(expectedBand);
  });

  it("puts every price in exactly one band", () => {
    for (const price of [1, 9999, 10000, 10001, 29999, 30000, 60000, 60001, 999999]) {
      expect(PRICE_BANDS.filter((band) => isPriceInBand(price, band))).toHaveLength(1);
    }
  });

  it("finds bands by id and ignores unknown ids", () => {
    expect(findPriceBand("100-300")?.id).toBe("100-300");
    expect(findPriceBand("nope")).toBeUndefined();
    expect(findPriceBand(undefined)).toBeUndefined();
  });
});
