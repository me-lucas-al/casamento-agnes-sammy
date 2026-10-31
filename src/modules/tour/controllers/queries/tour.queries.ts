import { getSessionUser } from "@/modules/auth/controllers/get-session-user";
import { guardedQuery } from "@/shared/lib/guarded-query";
import { withLoggedFallback } from "@/shared/lib/logged-fallback";
import { getTourModule } from "@/modules/tour/factory";

export async function getTourStatusQuery() {
  return guardedQuery("getTourStatusQuery", async () => {
    const actor = await getSessionUser();
    return getTourModule().getTourStatus(actor);
  });
}

export async function shouldAutoOpenTourQuery(): Promise<boolean> {
  return withLoggedFallback("query.tour_auto_open_fallback", false, async () => {
    const actor = await getSessionUser();
    const status = await getTourModule().getTourStatus(actor);
    return !status.isCompleted;
  });
}
