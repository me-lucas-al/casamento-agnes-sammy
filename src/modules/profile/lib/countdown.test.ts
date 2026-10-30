import { describe, expect, it } from "vitest";
import { computeCountdown } from "./countdown";

const target = new Date("2026-11-07T22:00:00.000Z");

describe("computeCountdown", () => {
  it("splits remaining time into days, hours, minutes and seconds", () => {
    const now = new Date("2026-11-04T20:58:55.000Z");

    expect(computeCountdown(target, now)).toEqual({ isOver: false, days: 3, hours: 1, minutes: 1, seconds: 5 });
  });

  it("is over exactly at the target", () => {
    expect(computeCountdown(target, target).isOver).toBe(true);
  });

  it("is over after the target with zeroed fields", () => {
    const now = new Date("2026-12-01T00:00:00.000Z");

    expect(computeCountdown(target, now)).toEqual({ isOver: true, days: 0, hours: 0, minutes: 0, seconds: 0 });
  });
});
