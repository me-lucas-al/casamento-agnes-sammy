"use server";

import { hasRole } from "@/modules/auth/authorization";
import { getSessionUser } from "@/modules/auth/controllers/get-session-user";
import { eventTag } from "@/shared/lib/cache/cache-tags";
import { nextCacheInvalidator } from "@/shared/lib/cache/invalidate";
import { safeAction } from "@/shared/lib/safe-action";
import { failure, success, type ActionResult } from "@/shared/lib/result";
import { describeEventError } from "../errors";
import { getEventModule } from "../factory";

export async function resetEventSettingsAction(): Promise<ActionResult> {
  return safeAction(describeEventError, async () => {
    const actor = await getSessionUser();
    if (!hasRole(actor, ["admin", "couple"])) return failure("Sem permissão para esta ação.");
    await getEventModule().resetEventSettings(actor);
    nextCacheInvalidator.invalidateTags([eventTag()]);
    nextCacheInvalidator.invalidatePath("/");
    nextCacheInvalidator.invalidatePath("/painel/evento");
    return success();
  }, "resetEventSettingsAction");
}
