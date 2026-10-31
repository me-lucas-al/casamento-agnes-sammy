"use server";

import { getSessionUser } from "@/modules/auth/controllers/session/get-session-user";
import { nextCacheInvalidator } from "@/shared/lib/cache/invalidate";
import type { ActionResult } from "@/shared/lib/result";
import { safeAction } from "@/shared/lib/safe-action";
import { describeEventError } from "@/modules/event/errors";
import { getEventModule } from "@/modules/event/factory";
import { runUpdateEventSettings } from "../handlers/run-update-event-settings";

export async function updateEventSettingsAction(input: unknown): Promise<ActionResult> {
  return safeAction(describeEventError, async () => {
    const actor = await getSessionUser();
    return runUpdateEventSettings(
      { eventModule: getEventModule(), cacheInvalidator: nextCacheInvalidator },
      actor,
      input,
    );
  }, "updateEventSettingsAction");
}
