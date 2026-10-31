import { describe, expect, it } from "vitest";
import { ownProfileSchema } from "../own-profile.schema";

const validInput = { name: "Maria Silva", phone: "(11) 99999-0000", email: "maria@example.com" };

describe("ownProfileSchema", () => {
  it("accepts complete data and defaults relatives to an empty list", () => {
    const parsed = ownProfileSchema.parse(validInput);

    expect(parsed.relatives).toEqual([]);
  });

  it.each([
    ["short name", { name: "M" }],
    ["missing phone", { phone: "" }],
    ["invalid phone", { phone: "abc" }],
    ["phone with too few digits", { phone: "(11) 9999-00" }],
    ["phone with too many digits", { phone: "+55 11 99999-0000 12" }],
    ["invalid email", { email: "maria" }],
    ["blank relative", { relatives: [{ name: "  " }] }],
  ])("rejects %s", (_label, override) => {
    expect(ownProfileSchema.safeParse({ ...validInput, ...override }).success).toBe(false);
  });

  it("stores the phone as digits only", () => {
    expect(ownProfileSchema.parse(validInput).phone).toBe("11999990000");
    expect(ownProfileSchema.parse({ ...validInput, phone: "+55 (11) 99999-0000" }).phone).toBe("5511999990000");
  });

  it("trims the email before validating it", () => {
    const parsed = ownProfileSchema.parse({ ...validInput, email: "  maria@example.com  " });

    expect(parsed.email).toBe("maria@example.com");
  });

  it("turns an empty dietary note into null", () => {
    const parsed = ownProfileSchema.parse({ ...validInput, relatives: [{ name: "João", dietaryNote: "" }] });

    expect(parsed.relatives[0].dietaryNote).toBeNull();
  });
});
