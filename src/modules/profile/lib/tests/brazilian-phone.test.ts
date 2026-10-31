import { describe, expect, it } from "vitest";
import { normalizeBrazilianPhone } from "../brazilian-phone";

describe("normalizeBrazilianPhone", () => {
  it.each([
    ["(11) 99999-0000", "11999990000"],
    ["11 3333-4444", "1133334444"],
    ["+55 (11) 99999-0000", "5511999990000"],
    ["55 11 3333-4444", "551133334444"],
  ])("normalizes %s", (raw, expected) => {
    expect(normalizeBrazilianPhone(raw)).toBe(expected);
  });

  it.each(["", "abc", "1234", "---() ---", "999999999", "123456789012", "1199999000011", "+1 415 555 2671 99"])(
    "rejects %j",
    (raw) => {
      expect(normalizeBrazilianPhone(raw)).toBeNull();
    },
  );
});
