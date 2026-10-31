import { getSessionUser } from "@/modules/auth/controllers/session/get-session-user";
import { guardedQuery } from "@/shared/lib/resilience/guarded-query";
import { getDashboardModule } from "@/modules/dashboard/factory";

export async function getOnboardingStatusQuery() {
  return guardedQuery("getOnboardingStatusQuery", async () => {
    const actor = await getSessionUser();
    return getDashboardModule().getOnboardingStatus(actor);
  });
}

export async function getDashboardTotalsQuery() {
  return guardedQuery("getDashboardTotalsQuery", async () => {
    const actor = await getSessionUser();
    return getDashboardModule().getDashboardTotals(actor);
  });
}
