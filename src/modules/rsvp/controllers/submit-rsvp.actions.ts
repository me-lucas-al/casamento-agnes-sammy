"use server";

import { getSessionUser } from "@/modules/auth/controllers/get-session-user";
import { invalidateRsvpCache } from "../lib/invalidate-rsvp-cache";
import { nextCacheInvalidator } from "@/shared/lib/cache/invalidate";
import { failure, success, type ActionResult } from "@/shared/lib/result";
import { describeRsvpError } from "../errors";
import { getRsvpModule } from "../factory";
import { submitRsvpForGuestSchema, submitRsvpSchema } from "../schemas/submit-rsvp.schema";

export async function submitRsvpAction(input: unknown): Promise<ActionResult> {
  const parsed = submitRsvpSchema.safeParse(input);
  if (!parsed.success) return failure("Dados inválidos.");
  try {
    const actor = await getSessionUser();
    const guestId = actor?.guestId ?? "";
    await getRsvpModule().submitRsvp(actor, { ...parsed.data, guestId });
    invalidateRsvpCache(nextCacheInvalidator, guestId);
    return success();
  } catch (error) {
    return failure(describeRsvpError(error));
  }
}

export async function submitRsvpForGuestAction(input: unknown): Promise<ActionResult> {
  const parsed = submitRsvpForGuestSchema.safeParse(input);
  if (!parsed.success) return failure("Dados inválidos.");
  try {
    const actor = await getSessionUser();
    await getRsvpModule().submitRsvp(actor, parsed.data);
    invalidateRsvpCache(nextCacheInvalidator, parsed.data.guestId);
    return success();
  } catch (error) {
    return failure(describeRsvpError(error));
  }
}
