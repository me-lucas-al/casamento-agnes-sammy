import { describe, expect, it } from "vitest";
import { ACCESS_CODE_LENGTH, normalizeAccessCode } from "../access-code";

describe("normalizeAccessCode", () => {
  it("uppercases and trims", () => {
    expect(normalizeAccessCode("  k7m2qx9p ")).toBe("K7M2QX9P");
  });

  it("drops separators and symbols", () => {
    expect(normalizeAccessCode("K7M2-QX9P")).toBe("K7M2QX9P");
    expect(normalizeAccessCode(" K7 M2.QX9P!")).toBe("K7M2QX9P");
  });

  it("is idempotent", () => {
    expect(normalizeAccessCode(normalizeAccessCode(" k7m2-qx9p "))).toBe("K7M2QX9P");
  });

  it("limits the length", () => {
    expect(normalizeAccessCode("ABCDEFGHJKMN")).toHaveLength(ACCESS_CODE_LENGTH);
  });
});
