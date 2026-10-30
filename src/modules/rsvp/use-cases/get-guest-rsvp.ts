import { requireRole } from "@/modules/auth/authorization";
import { ForbiddenError } from "@/modules/auth/errors";
import type { SessionUser } from "@/modules/auth/types";
import { RsvpGuestNotFoundError } from "../errors";
import type { RsvpRepository } from "../repositories/rsvp-repository";
import type { GuestRsvp } from "../types";

type Dependencies = { rsvpRepository: RsvpRepository };

export function makeGetGuestRsvp({ rsvpRepository }: Dependencies) {
  return async function getGuestRsvp(actor: SessionUser | null, guestId: string): Promise<GuestRsvp> {
    const user = requireRole(actor, ["admin", "couple", "guest"]);
    if (user.role === "guest" && user.guestId !== guestId) throw new ForbiddenError();
    const guestRsvp = await rsvpRepository.findGuestRsvp(guestId);
    if (!guestRsvp) throw new RsvpGuestNotFoundError();
    return guestRsvp;
  };
}
