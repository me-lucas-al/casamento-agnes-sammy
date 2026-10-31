import { describe, expect, it } from "vitest";
import { ForbiddenError, UnauthenticatedError } from "@/modules/auth/errors";
import { asUser } from "@/tests/helpers/fakes/fake-session";
import { requireGuestId } from "../require-guest-id";

describe("requireGuestId", () => {
  it("returns the guest id of a guest session", () => {
    const session = asUser("guest");
    expect(requireGuestId(session)).toBe(session.guestId);
  });

  it("rejects anonymous sessions", () => {
    expect(() => requireGuestId(null)).toThrow(UnauthenticatedError);
  });

  it.each(["admin", "couple"] as const)("rejects %s sessions", (role) => {
    expect(() => requireGuestId(asUser(role))).toThrow(ForbiddenError);
  });
});
