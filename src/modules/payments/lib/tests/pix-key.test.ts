import { describe, expect, it } from "vitest";
import { normalizePixKey } from "../pix-key";

describe("normalizePixKey", () => {
  it("keeps only digits for cpf and cnpj", () => {
    expect(normalizePixKey("123.456.789-09", "cpf")).toBe("12345678909");
    expect(normalizePixKey("12.345.678/0001-95", "cnpj")).toBe("12345678000195");
  });

  it("prefixes brazilian phones with +55", () => {
    expect(normalizePixKey("(11) 91234-5678", "phone")).toBe("+5511912345678");
    expect(normalizePixKey("+55 11 91234-5678", "phone")).toBe("+5511912345678");
  });

  it("lowercases emails and trims random keys", () => {
    expect(normalizePixKey(" Casal@Email.com ", "email")).toBe("casal@email.com");
    expect(normalizePixKey(" 123e4567-e12b-12d1-a456-426655440000 ", "random")).toBe(
      "123e4567-e12b-12d1-a456-426655440000",
    );
  });
});
