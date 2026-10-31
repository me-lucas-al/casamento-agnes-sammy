"use server";

import { getSessionUser } from "@/modules/auth/controllers/session/get-session-user";
import { invalidateRsvpCache } from "@/modules/rsvp/lib/invalidate-rsvp-cache";
import { contributionsTag, pendingPaymentsTag } from "@/shared/lib/cache/cache-tags";
import { nextCacheInvalidator } from "@/shared/lib/cache/invalidate";
import { success, type ActionResult } from "@/shared/lib/result";
import { safeAction } from "@/shared/lib/safe-action";
import { invalidInput } from "@/shared/lib/validation-failure";
import { describeProfileError } from "@/modules/profile/errors";
import { getProfileModule } from "@/modules/profile/factory";
import { ownProfileSchema } from "@/modules/profile/schemas/own-profile.schema";

export async function updateMyProfileAction(input: unknown): Promise<ActionResult> {
  const parsed = ownProfileSchema.safeParse(input);
  if (!parsed.success) return invalidInput(parsed);
  return safeAction(describeProfileError, async () => {
    const actor = await getSessionUser();
    const profile = await getProfileModule().updateOwnProfile(actor, parsed.data);
    invalidateRsvpCache(nextCacheInvalidator, profile.guestId);
    nextCacheInvalidator.invalidateTags([contributionsTag(profile.guestId), pendingPaymentsTag()]);
    nextCacheInvalidator.invalidatePath("/perfil");
    nextCacheInvalidator.invalidatePath("/inicio");
    nextCacheInvalidator.invalidatePath("/painel/convidados");
    return success();
  }, "updateMyProfileAction");
}
