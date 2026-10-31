import { calculateRsvpTotals } from "@/modules/rsvp/repositories/drizzle/drizzle-rsvp-list";
import type { Database } from "@/shared/db/types";
import { readContributionTotals } from "../drizzle/contribution-totals-query";
import type { DashboardRepository } from "./dashboard-repository";
import { readOnboardingFacts } from "../drizzle/onboarding-facts-query";
import { readPendingModeration } from "../drizzle/pending-moderation-query";

export function createDrizzleDashboardRepository(database: Database): DashboardRepository {
  return {
    async readTotals(now) {
      const [contributionTotals, attendance, moderation] = await Promise.all([
        readContributionTotals(database, now),
        calculateRsvpTotals(database),
        readPendingModeration(database),
      ]);
      return { ...contributionTotals, attendance, ...moderation };
    },
    readOnboardingFacts: () => readOnboardingFacts(database),
  };
}
