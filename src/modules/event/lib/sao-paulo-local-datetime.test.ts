import { describe, expect, it } from "vitest";
import { formatSaoPauloLocalDateTime, parseSaoPauloLocalDateTime } from "./sao-paulo-local-datetime";

describe("sao paulo local datetime", () => {
  it("parses local input as UTC-3", () => {
    expect(parseSaoPauloLocalDateTime("2026-11-07T19:00")?.toISOString()).toBe("2026-11-07T22:00:00.000Z");
  });

  it("returns null for invalid input", () => {
    expect(parseSaoPauloLocalDateTime("07/11/2026")).toBeNull();
    expect(parseSaoPauloLocalDateTime("2026-13-40T99:00")).toBeNull();
  });

  it("round trips to the input format", () => {
    const date = new Date("2026-11-07T22:00:00.000Z");
    expect(formatSaoPauloLocalDateTime(date)).toBe("2026-11-07T19:00");
  });
});
