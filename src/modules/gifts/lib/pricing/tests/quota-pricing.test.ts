import { describe, expect, it } from "vitest";
import { quotaPriceRange, quotasAmountCents } from "../quota-pricing";

describe("quota pricing", () => {
  it("gives equal quotas when price divides evenly", () => {
    expect(quotaPriceRange(30000, 3)).toEqual({ minCents: 10000, maxCents: 10000 });
  });

  it("spreads the remainder over the first quotas", () => {
    expect(quotaPriceRange(10000, 3)).toEqual({ minCents: 3333, maxCents: 3334 });
  });

  it("returns null without quotas", () => {
    expect(quotaPriceRange(10000, 0)).toBeNull();
  });

  it("sums the first N quotas and all quotas equal the price", () => {
    expect(quotasAmountCents(10000, 3, 1)).toBe(3334);
    expect(quotasAmountCents(10000, 3, 3)).toBe(10000);
  });
});
