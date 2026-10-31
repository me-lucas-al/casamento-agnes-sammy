import { hasRole } from "@/modules/auth/authorization";
import type { SessionUser } from "@/modules/auth/types";
import { eventTag } from "@/shared/lib/cache/cache-tags";
import type { CacheInvalidator } from "@/shared/lib/cache/invalidate";
import { safeAction } from "@/shared/lib/actions/safe-action";
import { invalidInput } from "@/shared/lib/actions/validation-failure";
import { failure, success, type ActionResult } from "@/shared/lib/actions/result";
import { describeEventError } from "@/modules/event/errors";
import type { EventModule } from "@/modules/event/factory";
import { updateEventSettingsSchema } from "@/modules/event/schemas/update-event-settings.schema";

type Dependencies = { eventModule: EventModule; cacheInvalidator: CacheInvalidator };

export async function runUpdateEventSettings(
  { eventModule, cacheInvalidator }: Dependencies,
  actor: SessionUser | null,
  input: unknown,
): Promise<ActionResult> {
  if (!hasRole(actor, ["admin", "couple"])) return failure("Sem permissão para esta ação.");
  const parsed = updateEventSettingsSchema.safeParse(input);
  if (!parsed.success) return invalidInput(parsed);
  return safeAction(describeEventError, async () => {
    await eventModule.updateEventSettings(actor, parsed.data);
    cacheInvalidator.invalidateTags([eventTag()]);
    cacheInvalidator.invalidatePath("/");
    cacheInvalidator.invalidatePath("/painel/evento");
    return success();
  }, "runUpdateEventSettings");
}
