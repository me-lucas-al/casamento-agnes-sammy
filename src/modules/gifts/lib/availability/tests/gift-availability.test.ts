import { describe, expect, it } from "vitest";
import { describeAvailability } from "../describe-availability";
import { computeGiftAvailability, EMPTY_CONTRIBUTION_TOTALS } from "../gift-availability";

const single = { id: "g", mode: "single", priceCents: 30000, totalQuotas: null } as const;
const quotas = { id: "g", mode: "fixed_quotas", priceCents: 30000, totalQuotas: 3 } as const;
const free = { id: "g", mode: "free_amount", priceCents: 100000, totalQuotas: null } as const;

describe("computeGiftAvailability", () => {
  it("single is available until someone holds it", () => {
    expect(computeGiftAvailability(single, EMPTY_CONTRIBUTION_TOTALS).state).toBe("available");
    const taken = computeGiftAvailability(single, { quotas: 0, amountCents: 30000, count: 1 });
    expect(taken).toMatchObject({ state: "complete", remainingCents: 0 });
  });

  it("fixed quotas go available, partial, complete", () => {
    expect(computeGiftAvailability(quotas, EMPTY_CONTRIBUTION_TOTALS)).toMatchObject({
      state: "available",
      remainingQuotas: 3,
      remainingCents: 30000,
    });
    expect(computeGiftAvailability(quotas, { quotas: 1, amountCents: 10000, count: 1 })).toMatchObject({
      state: "partial",
      takenQuotas: 1,
      remainingQuotas: 2,
      remainingCents: 20000,
    });
    expect(computeGiftAvailability(quotas, { quotas: 3, amountCents: 30000, count: 2 })).toMatchObject({
      state: "complete",
      remainingQuotas: 0,
      remainingCents: 0,
    });
  });

  it("free amount tracks remaining cents and never goes negative", () => {
    expect(computeGiftAvailability(free, { quotas: 0, amountCents: 25000, count: 2 })).toMatchObject({
      state: "partial",
      remainingCents: 75000,
    });
    expect(computeGiftAvailability(free, { quotas: 0, amountCents: 130000, count: 3 })).toMatchObject({
      state: "complete",
      remainingCents: 0,
    });
  });
});

describe("describeAvailability", () => {
  it("describes the three states without donor data", () => {
    expect(describeAvailability(computeGiftAvailability(quotas, EMPTY_CONTRIBUTION_TOTALS))).toBe("disponível");
    expect(describeAvailability(computeGiftAvailability(quotas, { quotas: 2, amountCents: 20000, count: 1 }))).toBe(
      "2 de 3 cotas",
    );
    expect(describeAvailability(computeGiftAvailability(quotas, { quotas: 3, amountCents: 30000, count: 1 }))).toBe(
      "completo",
    );
    expect(describeAvailability(computeGiftAvailability(free, { quotas: 0, amountCents: 25000, count: 1 }))).toBe(
      "25% arrecadado",
    );
  });
});
