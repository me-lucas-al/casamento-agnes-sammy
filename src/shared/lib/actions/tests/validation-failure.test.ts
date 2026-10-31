import { describe, expect, it } from "vitest";
import { z } from "zod";
import { describeValidationFailure, invalidInput } from "../validation-failure";

const schema = z.object({ name: z.string().min(1), email: z.email(), hidden: z.number() });

describe("validation failure", () => {
  it("lists failed fields with pt-BR labels", () => {
    const parsed = schema.safeParse({ name: "", email: "x", hidden: 1 });
    expect(describeValidationFailure(parsed)).toBe("Dados inválidos. Revise: nome, e-mail.");
  });

  it("falls back to the plain message when fields have no label", () => {
    const parsed = schema.safeParse({ name: "ok", email: "a@b.co", hidden: "x" });
    expect(describeValidationFailure(parsed)).toBe("Dados inválidos.");
  });

  it("merges several failed parses and ignores successful ones", () => {
    const failed = z.object({ giftId: z.uuid() }).safeParse({ giftId: "x" });
    const passed = schema.safeParse({ name: "a", email: "a@b.co", hidden: 1 });
    expect(describeValidationFailure(failed, passed)).toBe("Dados inválidos. Revise: presente.");
  });

  it("builds an action failure", () => {
    expect(invalidInput(schema.safeParse({}))).toEqual({
      ok: false,
      error: "Dados inválidos. Revise: nome, e-mail.",
    });
  });
});
