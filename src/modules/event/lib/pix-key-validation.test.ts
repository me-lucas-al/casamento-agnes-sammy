import { describe, expect, it } from "vitest";
import { isValidPixKey, normalizePixKey } from "./pix-key-validation";

describe("isValidPixKey", () => {
  it("accepts a formatted valid cpf and rejects a wrong check digit", () => {
    expect(isValidPixKey("cpf", "529.982.247-25")).toBe(true);
    expect(isValidPixKey("cpf", "529.982.247-24")).toBe(false);
  });

  it("rejects cpf with repeated digits or wrong length", () => {
    expect(isValidPixKey("cpf", "111.111.111-11")).toBe(false);
    expect(isValidPixKey("cpf", "1234")).toBe(false);
  });

  it("accepts a valid cnpj and rejects an invalid one", () => {
    expect(isValidPixKey("cnpj", "11.222.333/0001-81")).toBe(true);
    expect(isValidPixKey("cnpj", "11.222.333/0001-82")).toBe(false);
  });

  it("validates email", () => {
    expect(isValidPixKey("email", " Casal@Example.com ")).toBe(true);
    expect(isValidPixKey("email", "casal@")).toBe(false);
  });

  it("requires phone in +55 format", () => {
    expect(isValidPixKey("phone", "+55 (11) 91234-5678")).toBe(true);
    expect(isValidPixKey("phone", "11912345678")).toBe(false);
  });

  it("requires random key as uuid", () => {
    expect(isValidPixKey("random", "123e4567-e89b-12d3-a456-426614174000")).toBe(true);
    expect(isValidPixKey("random", "not-a-uuid")).toBe(false);
  });

  it("normalizes keys by type", () => {
    expect(normalizePixKey("cpf", "529.982.247-25")).toBe("52998224725");
    expect(normalizePixKey("email", " A@B.com ")).toBe("a@b.com");
  });
});
