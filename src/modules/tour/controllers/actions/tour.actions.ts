"use server";

import { getSessionUser } from "@/modules/auth/controllers/session/get-session-user";
import { getDashboardModule } from "@/modules/dashboard/factory";
import type { OnboardingStatus } from "@/modules/dashboard/types";
import { safeAction } from "@/shared/lib/actions/safe-action";
import { success, type ActionResult } from "@/shared/lib/actions/result";
import { describeTourError } from "@/modules/tour/errors";
import { getTourModule } from "@/modules/tour/factory";

export async function completeTourAction(): Promise<ActionResult> {
  return safeAction(describeTourError, async () => {
    const actor = await getSessionUser();
    await getTourModule().completeTour(actor);
    return success();
  }, "completeTourAction");
}

export async function restartTourAction(): Promise<ActionResult> {
  return safeAction(describeTourError, async () => {
    const actor = await getSessionUser();
    await getTourModule().restartTour(actor);
    return success();
  }, "restartTourAction");
}

export async function loadTourChecklistAction(): Promise<ActionResult<OnboardingStatus>> {
  return safeAction(describeTourError, async () => {
    const actor = await getSessionUser();
    return success(await getDashboardModule().getOnboardingStatus(actor));
  }, "loadTourChecklistAction");
}
