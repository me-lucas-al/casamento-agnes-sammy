import { describe, expect, it } from "vitest";
import { crc16Ccitt } from "./crc16";

describe("crc16Ccitt", () => {
  it("matches the CRC-16/CCITT-FALSE check value", () => {
    expect(crc16Ccitt("123456789")).toBe("29B1");
  });

  it("returns the initial value for empty input", () => {
    expect(crc16Ccitt("")).toBe("FFFF");
  });

  it("pads the checksum to four uppercase hex digits", () => {
    expect(crc16Ccitt("A")).toMatch(/^[0-9A-F]{4}$/);
  });

  it("changes when any character changes", () => {
    expect(crc16Ccitt("00020126")).not.toBe(crc16Ccitt("00020127"));
  });
});
