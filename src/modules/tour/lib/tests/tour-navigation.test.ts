import { describe, expect, it } from "vitest";
import {
  clampStepIndex,
  describeStepPosition,
  isLastStep,
  nextStepIndex,
  previousStepIndex,
  slideDirection,
} from "../tour-navigation";

describe("tour navigation", () => {
  it("moves forward and backward within bounds", () => {
    expect(nextStepIndex(0, 3)).toBe(1);
    expect(nextStepIndex(2, 3)).toBe(2);
    expect(previousStepIndex(1, 3)).toBe(0);
    expect(previousStepIndex(0, 3)).toBe(0);
  });

  it("clamps out-of-range indexes", () => {
    expect(clampStepIndex(-4, 3)).toBe(0);
    expect(clampStepIndex(9, 3)).toBe(2);
    expect(clampStepIndex(1, 0)).toBe(0);
  });

  it("detects the last step", () => {
    expect(isLastStep(2, 3)).toBe(true);
    expect(isLastStep(1, 3)).toBe(false);
  });

  it("describes the position in pt-BR", () => {
    expect(describeStepPosition(0, 11)).toBe("Passo 1 de 11");
    expect(describeStepPosition(10, 11)).toBe("Passo 11 de 11");
  });

  it("reports slide direction", () => {
    expect(slideDirection(1, 2)).toBe("forward");
    expect(slideDirection(2, 1)).toBe("backward");
  });
});
