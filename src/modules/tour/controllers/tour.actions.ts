"use server";

import { getSessionUser } from "@/modules/auth/controllers/get-session-user";
import { getDashboardModule } from "@/modules/dashboard/factory";
import type { OnboardingStatus } from "@/modules/dashboard/types";
import { safeAction } from "@/shared/lib/safe-action";
import { success, type ActionResult } from "@/shared/lib/result";
import { describeTourError } from "../errors";
import { getTourModule } from "../factory";

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
