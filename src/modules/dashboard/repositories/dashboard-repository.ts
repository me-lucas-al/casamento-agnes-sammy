import type { DashboardTotals, OnboardingFacts } from "../types";

export interface DashboardRepository {
  readTotals(now: Date): Promise<DashboardTotals>;
  readOnboardingFacts(): Promise<OnboardingFacts>;
}
