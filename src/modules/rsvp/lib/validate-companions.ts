import { CompanionLimitExceededError } from "../errors";
import type { Companion } from "../types";

export function normalizeCompanions(companions: readonly Companion[]): Companion[] {
  return companions
    .map(({ name, dietaryNote }) => ({
      name: name.trim(),
      dietaryNote: dietaryNote?.trim() || null,
    }))
    .filter(({ name }) => name.length > 0);
}

export function assertCompanionsFitSeats(companions: readonly Companion[], seats: number): void {
  if (companions.length > Math.max(seats - 1, 0)) throw new CompanionLimitExceededError();
}
