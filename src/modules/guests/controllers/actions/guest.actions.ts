"use server";

import { getSessionUser } from "@/modules/auth/controllers/session/get-session-user";
import { dashboardTag, guestTag } from "@/shared/lib/cache/cache-tags";
import { nextCacheInvalidator } from "@/shared/lib/cache/invalidate";
import { safeAction } from "@/shared/lib/actions/safe-action";
import { invalidInput } from "@/shared/lib/actions/validation-failure";
import { success, type ActionResult } from "@/shared/lib/actions/result";
import { describeGuestError } from "@/modules/guests/errors";
import { getGuestModule } from "@/modules/guests/factory";
import { guestDetailsSchema, guestIdSchema, updateGuestSchema } from "@/modules/guests/schemas/guest-details.schema";

const GUESTS_PATH = "/painel/convidados";

function refreshGuest(guestId: string) {
  nextCacheInvalidator.invalidateTags([guestTag(guestId), dashboardTag()]);
  nextCacheInvalidator.invalidatePath(GUESTS_PATH);
}

export async function createGuestAction(input: unknown): Promise<ActionResult<{ guestId: string }>> {
  const parsed = guestDetailsSchema.safeParse(input);
  if (!parsed.success) return invalidInput(parsed);
  return safeAction(describeGuestError, async () => {
    const guest = await getGuestModule().createGuest(await getSessionUser(), parsed.data);
    nextCacheInvalidator.invalidateTags([dashboardTag()]);
    nextCacheInvalidator.invalidatePath(GUESTS_PATH);
    return success({ guestId: guest.id });
  }, "createGuestAction");
}

export async function updateGuestAction(input: unknown): Promise<ActionResult> {
  const parsed = updateGuestSchema.safeParse(input);
  if (!parsed.success) return invalidInput(parsed);
  const { guestId, ...details } = parsed.data;
  return safeAction(describeGuestError, async () => {
    await getGuestModule().updateGuest(await getSessionUser(), guestId, details);
    refreshGuest(guestId);
    return success();
  }, "updateGuestAction");
}

export async function deleteGuestAction(input: unknown): Promise<ActionResult> {
  const parsed = guestIdSchema.safeParse(input);
  if (!parsed.success) return invalidInput(parsed);
  return safeAction(describeGuestError, async () => {
    await getGuestModule().deleteGuest(await getSessionUser(), parsed.data.guestId);
    refreshGuest(parsed.data.guestId);
    return success();
  }, "deleteGuestAction");
}

export async function regenerateGuestCodeAction(input: unknown): Promise<ActionResult<{ code: string }>> {
  const parsed = guestIdSchema.safeParse(input);
  if (!parsed.success) return invalidInput(parsed);
  return safeAction(describeGuestError, async () => {
    const guest = await getGuestModule().regenerateGuestCode(await getSessionUser(), parsed.data.guestId);
    refreshGuest(guest.id);
    return success({ code: guest.code });
  }, "regenerateGuestCodeAction");
}
