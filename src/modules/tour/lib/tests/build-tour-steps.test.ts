import { describe, expect, it } from "vitest";
import { buildTourSteps } from "../build-tour-steps";

describe("buildTourSteps", () => {
  it("shows the users step only to admins", () => {
    const adminIds = buildTourSteps("admin").map((step) => step.id);
    const coupleIds = buildTourSteps("couple").map((step) => step.id);

    expect(adminIds).toContain("users");
    expect(coupleIds).not.toContain("users");
    expect(adminIds).toHaveLength(coupleIds.length + 1);
  });

  it("starts with the welcome step and ends with the final step", () => {
    const ids = buildTourSteps("couple").map((step) => step.id);

    expect(ids[0]).toBe("welcome");
    expect(ids.at(-1)).toBe("final");
  });

  it("returns no steps for guests", () => {
    expect(buildTourSteps("guest")).toEqual([]);
  });

  it("has unique step ids and panel shortcuts only inside /painel", () => {
    const steps = buildTourSteps("admin");

    expect(new Set(steps.map((step) => step.id)).size).toBe(steps.length);
    for (const step of steps) if (step.href) expect(step.href.startsWith("/painel")).toBe(true);
  });
});
