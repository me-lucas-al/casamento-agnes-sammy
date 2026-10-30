import { describe, expect, it } from "vitest";
import { formatCentsAsBrl, isValidCents, parseBrlToCents, splitCentsIntoQuotas } from "./money";

describe("formatCentsAsBrl", () => {
  it("formats cents as BRL", () => {
    expect(formatCentsAsBrl(123456).replace(/\s/g, " ")).toBe("R$ 1.234,56");
  });
});

describe("parseBrlToCents", () => {
  it.each([
    ["10", 1000],
    ["10,5", 1050],
    ["R$ 1.234,56", 123456],
    ["0,99", 99],
  ])("parses %j", (text, cents) => {
    expect(parseBrlToCents(text)).toBe(cents);
  });

  it.each(["", "abc", "-5", "1,234", "1,2,3"])("rejects %j", (text) => {
    expect(parseBrlToCents(text)).toBeNull();
  });
});

describe("isValidCents", () => {
  it("accepts non-negative integers only", () => {
    expect(isValidCents(100)).toBe(true);
    expect(isValidCents(0)).toBe(true);
    expect(isValidCents(10.5)).toBe(false);
    expect(isValidCents(-1)).toBe(false);
  });
});

describe("splitCentsIntoQuotas", () => {
  it("splits evenly", () => {
    expect(splitCentsIntoQuotas(30000, 3)).toEqual([10000, 10000, 10000]);
  });

  it("distributes the remainder without losing cents", () => {
    const quotas = splitCentsIntoQuotas(10000, 3);
    expect(quotas).toEqual([3334, 3333, 3333]);
    expect(quotas.reduce((sum, value) => sum + value, 0)).toBe(10000);
  });

  it("returns empty for invalid quota count", () => {
    expect(splitCentsIntoQuotas(100, 0)).toEqual([]);
  });
});
