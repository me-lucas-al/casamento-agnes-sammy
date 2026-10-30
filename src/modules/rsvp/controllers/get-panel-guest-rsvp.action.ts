"use server";

import { getSessionUser } from "@/modules/auth/controllers/get-session-user";
import { safeAction } from "@/shared/lib/safe-action";
import { invalidInput } from "@/shared/lib/validation-failure";
import { success, type ActionResult } from "@/shared/lib/result";
import { describeRsvpError } from "../errors";
import { getRsvpModule } from "../factory";
import { guestIdSchema } from "../schemas/submit-rsvp.schema";
import type { GuestRsvp } from "../types";

export async function getPanelGuestRsvpAction(guestId: string): Promise<ActionResult<GuestRsvp>> {
  const parsedGuestId = guestIdSchema.safeParse(guestId);
  if (!parsedGuestId.success) return invalidInput(parsedGuestId);
  return safeAction(describeRsvpError, async () => {
    const actor = await getSessionUser();
    return success(await getRsvpModule().getGuestRsvp(actor, guestId));
  }, "getPanelGuestRsvpAction");
}
