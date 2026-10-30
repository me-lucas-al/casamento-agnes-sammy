import { describe, expect, it } from "vitest";
import type { OnboardingFacts } from "../types";
import { buildOnboardingStatus } from "./build-onboarding-steps";

const nothingDone: OnboardingFacts = { hasPixData: false, hasStory: false, photoCount: 0, giftCount: 0 };

describe("buildOnboardingStatus", () => {
  it("lists the four steps in order, all pending at the start", () => {
    const status = buildOnboardingStatus(nothingDone);

    expect(status.steps.map((step) => step.key)).toEqual(["pix", "story", "photos", "gifts"]);
    expect(status.doneCount).toBe(0);
    expect(status.isComplete).toBe(false);
  });

  it("links each step to the panel section where it is done", () => {
    const hrefs = buildOnboardingStatus(nothingDone).steps.map((step) => step.href);

    expect(hrefs).toEqual(["/painel/evento", "/painel/evento", "/painel/fotos", "/painel/presentes"]);
  });

  it("marks steps as done from the facts", () => {
    const status = buildOnboardingStatus({ ...nothingDone, hasPixData: true, photoCount: 2 });

    expect(status.steps.filter((step) => step.isDone).map((step) => step.key)).toEqual(["pix", "photos"]);
    expect(status.doneCount).toBe(2);
  });

  it("is complete when every step is done", () => {
    const status = buildOnboardingStatus({ hasPixData: true, hasStory: true, photoCount: 1, giftCount: 1 });

    expect(status.isComplete).toBe(true);
  });
});
