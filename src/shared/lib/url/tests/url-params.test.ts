import { describe, expect, it } from "vitest";
import { buildQueryString, enumParam, firstValue, textParam } from "../url-params";

describe("firstValue", () => {
  it("handles string, array and undefined", () => {
    expect(firstValue("a")).toBe("a");
    expect(firstValue(["a", "b"])).toBe("a");
    expect(firstValue(undefined)).toBeUndefined();
  });
});

describe("textParam", () => {
  it("trims and limits length", () => {
    expect(textParam({ search: "  rosa  " }, "search")).toBe("rosa");
    expect(textParam({ search: "x".repeat(300) }, "search")).toHaveLength(100);
  });

  it("returns empty string when missing", () => {
    expect(textParam({}, "search")).toBe("");
  });
});

describe("enumParam", () => {
  it("returns the value only when allowed", () => {
    expect(enumParam({ status: "pending" }, "status", ["pending", "approved"])).toBe("pending");
    expect(enumParam({ status: "hacked" }, "status", ["pending", "approved"])).toBeUndefined();
  });
});

describe("buildQueryString", () => {
  it("preserves current filters and applies changes", () => {
    const query = buildQueryString({ search: "copo", page: "2" }, { page: 3 });
    expect(query).toBe("?search=copo&page=3");
  });

  it("removes empty and null values", () => {
    const query = buildQueryString({ search: "copo", page: "2" }, { search: "", page: null });
    expect(query).toBe("");
  });

  it("uses first value of repeated params", () => {
    expect(buildQueryString({ category: ["a", "b"] }, {})).toBe("?category=a");
  });
});
