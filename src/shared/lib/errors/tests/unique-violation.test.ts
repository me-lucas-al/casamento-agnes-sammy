import { describe, expect, it } from "vitest";
import { isUniqueViolation } from "../unique-violation";

describe("isUniqueViolation", () => {
  it("recognizes the postgres unique violation code", () => {
    expect(isUniqueViolation(Object.assign(new Error("dup"), { code: "23505" }))).toBe(true);
  });

  it("looks through wrapped causes", () => {
    const wrapped = new Error("query failed", { cause: Object.assign(new Error("dup"), { code: "23505" }) });
    expect(isUniqueViolation(wrapped)).toBe(true);
  });

  it("matches the constraint name when the driver reports one", () => {
    const violation = Object.assign(new Error("dup"), { code: "23505", constraint: "photos_idx" });
    expect(isUniqueViolation(violation, "photos_idx")).toBe(true);
    expect(isUniqueViolation(violation, "other_idx")).toBe(false);
  });

  it("ignores other errors and non-objects", () => {
    expect(isUniqueViolation(Object.assign(new Error("x"), { code: "23503" }))).toBe(false);
    expect(isUniqueViolation(new Error("x"))).toBe(false);
    expect(isUniqueViolation(null)).toBe(false);
    expect(isUniqueViolation("23505")).toBe(false);
  });
});
