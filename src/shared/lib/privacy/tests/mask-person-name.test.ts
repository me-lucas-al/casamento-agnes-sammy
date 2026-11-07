import { describe, expect, it } from "vitest";
import { maskPersonName } from "../mask-person-name";

describe("maskPersonName", () => {
  it("keeps the first name and the initial of the last name", () => {
    expect(maskPersonName("Maria Souza Lima")).toBe("Maria L.");
  });

  it("keeps a single name as it is", () => {
    expect(maskPersonName("Maria")).toBe("Maria");
  });

  it("handles extra spaces and empty text", () => {
    expect(maskPersonName("  joão   álvares ")).toBe("joão Á.");
    expect(maskPersonName("   ")).toBe("");
  });
});
