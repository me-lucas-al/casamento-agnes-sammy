export function clampStepIndex(index: number, stepCount: number): number {
  if (stepCount <= 0) return 0;
  return Math.min(Math.max(index, 0), stepCount - 1);
}

export function nextStepIndex(index: number, stepCount: number): number {
  return clampStepIndex(index + 1, stepCount);
}

export function previousStepIndex(index: number, stepCount: number): number {
  return clampStepIndex(index - 1, stepCount);
}

export function isLastStep(index: number, stepCount: number): boolean {
  return index >= stepCount - 1;
}

export function describeStepPosition(index: number, stepCount: number): string {
  return `Passo ${clampStepIndex(index, stepCount) + 1} de ${stepCount}`;
}

export function slideDirection(previousIndex: number, currentIndex: number): "forward" | "backward" {
  return currentIndex >= previousIndex ? "forward" : "backward";
}
