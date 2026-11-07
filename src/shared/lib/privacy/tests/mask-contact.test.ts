import { describe, expect, it } from "vitest";
import { maskAccessCode, maskEmail, maskPhone, maskPixKey } from "../mask-contact";

describe("maskAccessCode", () => {
  it("hides every character so no part of the code can be guessed", () => {
    expect(maskAccessCode("K7M2QX9P")).toBe("••••••••");
  });

  it("hides short codes completely", () => {
    expect(maskAccessCode("AB12")).toBe("••••");
  });
});

describe("maskPhone", () => {
  it("keeps the format and the last two digits", () => {
    expect(maskPhone("(11) 98765-4321")).toBe("(••) •••••-••21");
  });
});

describe("maskEmail", () => {
  it("keeps the first letter and the domain", () => {
    expect(maskEmail("lucas@gmail.com")).toBe("l••••@gmail.com");
  });

  it("masks text that is not an email", () => {
    expect(maskEmail("lucas")).toBe("l••••");
  });
});

describe("maskPixKey", () => {
  it("masks an email key like an email", () => {
    expect(maskPixKey("casal@pix.com")).toBe("c••••@pix.com");
  });

  it("keeps only the last two characters of other keys", () => {
    expect(maskPixKey("123.456.789-09")).toBe("•••.•••.•••-09");
    expect(maskPixKey("+5511987654321")).toBe("+•••••••••••21");
  });
});
