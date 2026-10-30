import { hasRole } from "@/modules/auth/authorization";
import type { SessionUser } from "@/modules/auth/types";
import { eventTag } from "@/shared/lib/cache/cache-tags";
import type { CacheInvalidator } from "@/shared/lib/cache/invalidate";
import { failure, success, type ActionResult } from "@/shared/lib/result";
import { describeEventError } from "../errors";
import type { EventModule } from "../factory";
import { updateEventSettingsSchema } from "../schemas/update-event-settings.schema";

type Dependencies = { eventModule: EventModule; cacheInvalidator: CacheInvalidator };

export async function runUpdateEventSettings(
  { eventModule, cacheInvalidator }: Dependencies,
  actor: SessionUser | null,
  input: unknown,
): Promise<ActionResult> {
  if (!hasRole(actor, ["admin", "couple"])) return failure("Sem permissão para esta ação.");
  const parsed = updateEventSettingsSchema.safeParse(input);
  if (!parsed.success) return failure("Dados inválidos. Revise os campos.");
  try {
    await eventModule.updateEventSettings(actor, parsed.data);
    cacheInvalidator.invalidateTags([eventTag()]);
    cacheInvalidator.invalidatePath("/");
    cacheInvalidator.invalidatePath("/painel/evento");
    return success();
  } catch (error) {
    return failure(describeEventError(error));
  }
}
