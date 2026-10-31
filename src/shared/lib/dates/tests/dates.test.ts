import { describe, expect, it } from "vitest";
import {
  addHours,
  addMinutes,
  formatDateInSaoPaulo,
  formatDateTimeInSaoPaulo,
  formatLongDateInSaoPaulo,
  isExpired,
} from "../dates";

describe("formatting in America/Sao_Paulo", () => {
  it("shows the wedding time in local time", () => {
    const weddingAt = new Date("2026-11-07T22:00:00.000Z");
    expect(formatDateTimeInSaoPaulo(weddingAt)).toBe("07/11/2026, 19:00");
  });

  it("uses the local day near midnight UTC", () => {
    expect(formatDateInSaoPaulo(new Date("2026-11-08T01:00:00.000Z"))).toBe("07/11/2026");
  });
});

describe("date arithmetic", () => {
  const base = new Date("2026-11-01T00:00:00.000Z");

  it("adds hours", () => {
    expect(addHours(base, 48).toISOString()).toBe("2026-11-03T00:00:00.000Z");
  });

  it("adds minutes", () => {
    expect(addMinutes(base, 15).toISOString()).toBe("2026-11-01T00:15:00.000Z");
  });
});

describe("isExpired", () => {
  const now = new Date("2026-11-01T12:00:00.000Z");

  it("is expired when expiry is in the past or now", () => {
    expect(isExpired(new Date("2026-11-01T11:59:59.000Z"), now)).toBe(true);
    expect(isExpired(now, now)).toBe(true);
  });

  it("is not expired when expiry is in the future", () => {
    expect(isExpired(new Date("2026-11-01T12:00:01.000Z"), now)).toBe(false);
  });
});

describe("formatLongDateInSaoPaulo", () => {
  it("writes the month in full in pt-BR", () => {
    expect(formatLongDateInSaoPaulo(new Date("2026-11-07T22:00:00.000Z"))).toBe("7 de novembro de 2026");
  });
});
