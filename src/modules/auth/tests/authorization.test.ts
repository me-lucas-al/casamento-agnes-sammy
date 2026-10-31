import { describe, expect, it } from "vitest";
import { asUser } from "@/tests/helpers/fakes/fake-session";
import { hasRole, requireRole } from "../authorization";
import { ForbiddenError, UnauthenticatedError } from "../errors";

describe("requireRole", () => {
  it("returns the user when the role is allowed", () => {
    const admin = asUser("admin");
    expect(requireRole(admin, ["admin", "couple"])).toBe(admin);
  });

  it("throws UnauthenticatedError without a user", () => {
    expect(() => requireRole(null, ["admin"])).toThrow(UnauthenticatedError);
    expect(() => requireRole(undefined, ["admin"])).toThrow(UnauthenticatedError);
  });

  it("throws ForbiddenError for other roles", () => {
    expect(() => requireRole(asUser("guest"), ["admin", "couple"])).toThrow(ForbiddenError);
    expect(() => requireRole(asUser("couple"), ["admin"])).toThrow(ForbiddenError);
  });
});

describe("hasRole", () => {
  it("is false for anonymous and non-matching roles", () => {
    expect(hasRole(null, ["admin"])).toBe(false);
    expect(hasRole(asUser("guest"), ["admin"])).toBe(false);
    expect(hasRole(asUser("admin"), ["admin"])).toBe(true);
  });
});
