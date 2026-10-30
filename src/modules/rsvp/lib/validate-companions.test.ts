import { describe, expect, it } from "vitest";
import { CompanionLimitExceededError } from "../errors";
import { assertCompanionsFitSeats, normalizeCompanions } from "./validate-companions";

describe("normalizeCompanions", () => {
  it("trims names and notes and drops blank names", () => {
    const result = normalizeCompanions([
      { name: "  Ana  ", dietaryNote: "  vegana " },
      { name: "   ", dietaryNote: "x" },
      { name: "Bia", dietaryNote: "   " },
    ]);

    expect(result).toEqual([
      { name: "Ana", dietaryNote: "vegana" },
      { name: "Bia", dietaryNote: null },
    ]);
  });
});

describe("assertCompanionsFitSeats", () => {
  const companion = { name: "Ana", dietaryNote: null };

  it("accepts up to seats minus one companions", () => {
    expect(() => assertCompanionsFitSeats([companion, companion], 3)).not.toThrow();
    expect(() => assertCompanionsFitSeats([], 1)).not.toThrow();
  });

  it("rejects more companions than seats minus one", () => {
    expect(() => assertCompanionsFitSeats([companion], 1)).toThrow(CompanionLimitExceededError);
    expect(() => assertCompanionsFitSeats([companion, companion, companion], 3)).toThrow(
      CompanionLimitExceededError,
    );
  });
});
