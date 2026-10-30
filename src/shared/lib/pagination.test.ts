import { describe, expect, it } from "vitest";
import { buildPageResult, parsePageParams } from "./pagination";

describe("parsePageParams", () => {
  it("uses defaults when params are missing", () => {
    expect(parsePageParams({})).toEqual({ page: 1, perPage: 12, offset: 0 });
  });

  it("reads valid params and computes offset", () => {
    expect(parsePageParams({ page: "3", perPage: "24" })).toEqual({
      page: 3,
      perPage: 24,
      offset: 48,
    });
  });

  it.each(["0", "-2", "abc", "1.5", ""])("falls back to page 1 for %j", (page) => {
    expect(parsePageParams({ page }).page).toBe(1);
  });

  it.each(["10", "100", "abc", "-12"])("falls back to default perPage for %j", (perPage) => {
    expect(parsePageParams({ perPage }).perPage).toBe(12);
  });

  it("uses first value of repeated params", () => {
    expect(parsePageParams({ page: ["2", "5"] }).page).toBe(2);
  });
});

describe("buildPageResult", () => {
  it("computes totals and navigation flags", () => {
    const result = buildPageResult({ items: ["a"], total: 25, page: 2, perPage: 12 });
    expect(result).toMatchObject({ totalPages: 3, hasPreviousPage: true, hasNextPage: true });
  });

  it("reports a single page for an empty list", () => {
    const result = buildPageResult({ items: [], total: 0, page: 1, perPage: 12 });
    expect(result).toMatchObject({ totalPages: 1, hasPreviousPage: false, hasNextPage: false });
  });

  it("marks the last page", () => {
    const result = buildPageResult({ items: [], total: 24, page: 2, perPage: 12 });
    expect(result.hasNextPage).toBe(false);
  });
});
