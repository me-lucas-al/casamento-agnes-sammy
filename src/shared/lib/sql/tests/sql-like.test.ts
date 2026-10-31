import { describe, expect, it } from "vitest";
import { containsPattern, escapeLikePattern } from "../sql-like";

describe("escapeLikePattern", () => {
  it("escapes percent, underscore and backslash", () => {
    expect(escapeLikePattern("100%_a\\b")).toBe("100\\%\\_a\\\\b");
  });

  it("keeps plain text untouched", () => {
    expect(escapeLikePattern("Maria Silva")).toBe("Maria Silva");
  });
});

describe("containsPattern", () => {
  it("wraps escaped value with wildcards", () => {
    expect(containsPattern("a%")).toBe("%a\\%%");
  });
});
