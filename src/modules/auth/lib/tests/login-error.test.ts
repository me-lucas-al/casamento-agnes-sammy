import { describe, expect, it } from "vitest";
import { describeLoginError, parseLoginError } from "../login-error";

describe("parseLoginError", () => {
  it("accepts known NextAuth error codes", () => {
    expect(parseLoginError({ error: "AccessDenied" })).toBe("AccessDenied");
  });

  it("takes the first value of repeated params", () => {
    expect(parseLoginError({ error: ["Callback", "AccessDenied"] })).toBe("Callback");
  });

  it("ignores unknown or missing values", () => {
    expect(parseLoginError({ error: "<script>" })).toBeUndefined();
    expect(parseLoginError({})).toBeUndefined();
  });
});

describe("describeLoginError", () => {
  it("explains an unauthorized e-mail in pt-BR", () => {
    expect(describeLoginError("AccessDenied")).toMatch(/E-mail não autorizado/);
  });

  it("returns null without an error", () => {
    expect(describeLoginError(undefined)).toBeNull();
  });
});
