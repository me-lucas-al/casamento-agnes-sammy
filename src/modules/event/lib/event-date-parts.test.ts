import { describe, expect, it } from "vitest";
import { getEventDateParts } from "./event-date-parts";

describe("getEventDateParts", () => {
  it("formats the wedding date in Sao Paulo time", () => {
    expect(getEventDateParts(new Date("2026-11-07T22:00:00.000Z"))).toEqual({
      day: "07",
      month: "11",
      shortYear: "26",
      weekday: "Sábado",
      time: "19h",
    });
  });

  it("keeps minutes when not on the hour", () => {
    expect(getEventDateParts(new Date("2026-11-07T22:30:00.000Z")).time).toBe("19h30");
  });
});
