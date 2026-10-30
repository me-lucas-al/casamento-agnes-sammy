import { describe, expect, it } from "vitest";
import { countActiveContributions } from "./count-active-contributions";

describe("countActiveContributions", () => {
  it("counts only reserved and confirmed contributions", () => {
    const statuses = ["reserved", "confirmed", "cancelled", "expired", "reserved"].map((status) => ({ status }));

    expect(countActiveContributions(statuses)).toBe(3);
  });

  it("returns zero for an empty list", () => {
    expect(countActiveContributions([])).toBe(0);
  });
});
