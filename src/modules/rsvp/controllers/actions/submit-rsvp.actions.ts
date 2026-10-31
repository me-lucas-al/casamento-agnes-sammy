"use server";

import { getSessionUser } from "@/modules/auth/controllers/session/get-session-user";
import { invalidateRsvpCache } from "@/modules/rsvp/lib/invalidate-rsvp-cache";
import { nextCacheInvalidator } from "@/shared/lib/cache/invalidate";
import { safeAction } from "@/shared/lib/safe-action";
import { invalidInput } from "@/shared/lib/validation-failure";
import { success, type ActionResult } from "@/shared/lib/result";
import { describeRsvpError } from "@/modules/rsvp/errors";
import { getRsvpModule } from "@/modules/rsvp/factory";
import { requireGuestId } from "@/modules/rsvp/lib/require-guest-id";
import { guestIdSchema, submitRsvpForGuestSchema, submitRsvpSchema } from "@/modules/rsvp/schemas/submit-rsvp.schema";

export async function submitRsvpAction(input: unknown): Promise<ActionResult> {
  const parsed = submitRsvpSchema.safeParse(input);
  if (!parsed.success) return invalidInput(parsed);
  return safeAction(describeRsvpError, async () => {
    const actor = await getSessionUser();
    const guestId = requireGuestId(actor);
    await getRsvpModule().submitRsvp(actor, { ...parsed.data, guestId });
    invalidateRsvpCache(nextCacheInvalidator, guestId);
    return success();
  }, "submitRsvpAction");
}

export async function submitRsvpForGuestAction(input: unknown): Promise<ActionResult> {
  const parsed = submitRsvpForGuestSchema.safeParse(input);
  if (!parsed.success) return invalidInput(parsed);
  return safeAction(describeRsvpError, async () => {
    const actor = await getSessionUser();
    await getRsvpModule().submitRsvp(actor, parsed.data);
    invalidateRsvpCache(nextCacheInvalidator, parsed.data.guestId);
    return success();
  }, "submitRsvpForGuestAction");
}

export async function deleteRsvpAction(guestId: string): Promise<ActionResult> {
  const parsedGuestId = guestIdSchema.safeParse(guestId);
  if (!parsedGuestId.success) return invalidInput(parsedGuestId);
  return safeAction(describeRsvpError, async () => {
    const actor = await getSessionUser();
    await getRsvpModule().deleteRsvp(actor, guestId);
    invalidateRsvpCache(nextCacheInvalidator, guestId);
    return success();
  }, "deleteRsvpAction");
}
