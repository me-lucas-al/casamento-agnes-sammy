import { requireRole } from "@/modules/auth/authorization";
import type { SessionUser } from "@/modules/auth/types";
import { buildOnboardingStatus } from "../lib/build-onboarding-steps";
import type { DashboardRepository } from "../repositories/dashboard-repository";
import type { OnboardingStatus } from "../types";

type Dependencies = { dashboardRepository: DashboardRepository };

export function makeGetOnboardingStatus({ dashboardRepository }: Dependencies) {
  return async function getOnboardingStatus(actor: SessionUser | null): Promise<OnboardingStatus> {
    requireRole(actor, ["admin", "couple"]);
    const facts = await dashboardRepository.readOnboardingFacts();
    return buildOnboardingStatus(facts);
  };
}
