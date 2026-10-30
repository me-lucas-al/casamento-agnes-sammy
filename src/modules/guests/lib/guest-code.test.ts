import { describe, expect, it } from "vitest";
import { GUEST_CODE_ALPHABET, GUEST_CODE_LENGTH, generateGuestCode } from "./guest-code";

describe("generateGuestCode", () => {
  it("produces 8 characters from the unambiguous alphabet", () => {
    for (let attempt = 0; attempt < 200; attempt += 1) {
      const code = generateGuestCode();
      expect(code).toHaveLength(GUEST_CODE_LENGTH);
      expect(code).toMatch(/^[A-HJKMNP-Z2-9]{8}$/);
    }
  });

  it("never uses ambiguous characters", () => {
    expect(GUEST_CODE_ALPHABET).not.toMatch(/[0O1IL]/);
  });

  it("maps random indexes to alphabet characters", () => {
    expect(generateGuestCode(() => 0)).toBe("AAAAAAAA");
    expect(generateGuestCode((limit) => limit - 1)).toBe("99999999");
  });
});
