import { describe, expect, it } from "vitest";
import { isValidIsoDate } from "../iso-date";

describe("isValidIsoDate", () => {
  it("accepts real calendar dates only", () => {
    expect(isValidIsoDate("2026-11-01")).toBe(true);
    expect(isValidIsoDate("2026-02-29")).toBe(false);
    expect(isValidIsoDate("2026-13-40")).toBe(false);
    expect(isValidIsoDate("01/11/2026")).toBe(false);
    expect(isValidIsoDate(null)).toBe(false);
  });
});
