"use server";

import { getSessionUser } from "@/modules/auth/controllers/get-session-user";
import { failure, success, type ActionResult } from "@/shared/lib/result";
import { describeRsvpError } from "../errors";
import { getRsvpModule } from "../factory";
import { guestIdSchema } from "../schemas/submit-rsvp.schema";
import type { GuestRsvp } from "../types";

export async function getPanelGuestRsvpAction(guestId: string): Promise<ActionResult<GuestRsvp>> {
  if (!guestIdSchema.safeParse(guestId).success) return failure("Dados inválidos.");
  try {
    const actor = await getSessionUser();
    return success(await getRsvpModule().getGuestRsvp(actor, guestId));
  } catch (error) {
    return failure(describeRsvpError(error));
  }
}
