import { describe, expect, it } from "vitest";
import { isValidCronAuthorization } from "./cron-authorization";

describe("isValidCronAuthorization", () => {
  it("accepts the matching bearer token", () => {
    expect(isValidCronAuthorization("Bearer secret-1", "secret-1")).toBe(true);
  });

  it.each([null, "", "secret-1", "Bearer wrong-12", "Bearer secret", "Basic secret-1"])(
    "rejects %s",
    (header) => {
      expect(isValidCronAuthorization(header, "secret-1")).toBe(false);
    },
  );

  it("rejects when the secret is empty", () => {
    expect(isValidCronAuthorization("Bearer ", "")).toBe(false);
  });
});
