import { describe, expect, it } from "vitest";
import { InvalidGiftConfigurationError } from "../errors";
import { normalizeGiftConfiguration } from "./gift-configuration";

describe("normalizeGiftConfiguration", () => {
  it("clears quota fields for single mode", () => {
    expect(
      normalizeGiftConfiguration({ mode: "single", priceCents: 5000, totalQuotas: 4, minAmountCents: 100 }),
    ).toEqual({ mode: "single", priceCents: 5000, totalQuotas: null, minAmountCents: null });
  });

  it("requires totalQuotas between 2 and 1000 for fixed_quotas", () => {
    const build = (totalQuotas?: number | null) => () =>
      normalizeGiftConfiguration({ mode: "fixed_quotas", priceCents: 90000, totalQuotas });
    expect(build(undefined)).toThrow(InvalidGiftConfigurationError);
    expect(build(1)).toThrow(InvalidGiftConfigurationError);
    expect(build(1001)).toThrow(InvalidGiftConfigurationError);
    expect(build(3)()).toEqual({ mode: "fixed_quotas", priceCents: 90000, totalQuotas: 3, minAmountCents: null });
  });

  it("rejects quotas worth less than one cent", () => {
    expect(() => normalizeGiftConfiguration({ mode: "fixed_quotas", priceCents: 5, totalQuotas: 10 })).toThrow(
      InvalidGiftConfigurationError,
    );
  });

  it("requires minAmountCents within price for free_amount", () => {
    const build = (minAmountCents?: number | null) => () =>
      normalizeGiftConfiguration({ mode: "free_amount", priceCents: 100000, minAmountCents });
    expect(build(undefined)).toThrow(InvalidGiftConfigurationError);
    expect(build(0)).toThrow(InvalidGiftConfigurationError);
    expect(build(100001)).toThrow(InvalidGiftConfigurationError);
    expect(build(5000)()).toEqual({
      mode: "free_amount",
      priceCents: 100000,
      totalQuotas: null,
      minAmountCents: 5000,
    });
  });

  it("rejects non-positive and fractional prices", () => {
    for (const priceCents of [0, -1, 10.5]) {
      expect(() => normalizeGiftConfiguration({ mode: "single", priceCents })).toThrow(
        InvalidGiftConfigurationError,
      );
    }
  });
});
