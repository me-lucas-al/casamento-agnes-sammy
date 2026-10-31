import type { DashboardTotals, OnboardingFacts } from "@/modules/dashboard/types";

export interface DashboardRepository {
  readTotals(now: Date): Promise<DashboardTotals>;
  readOnboardingFacts(): Promise<OnboardingFacts>;
}
