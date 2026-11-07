import { requireRole } from "@/modules/auth/authorization";
import { ForbiddenError } from "@/modules/auth/errors";
import { isViewer } from "@/modules/auth/lib/is-viewer";
import { GUEST_AREA_READER_ROLES } from "@/modules/auth/role-groups";
import type { SessionUser } from "@/modules/auth/types";
import { RsvpGuestNotFoundError } from "../errors";
import { VIEWER_GUEST_RSVP } from "../lib/viewer-guest-rsvp";
import type { RsvpRepository } from "../repositories/contracts/rsvp-repository";
import type { GuestRsvp } from "../types";

type Dependencies = { rsvpRepository: RsvpRepository };

export function makeGetGuestRsvp({ rsvpRepository }: Dependencies) {
  return async function getGuestRsvp(actor: SessionUser | null, guestId: string): Promise<GuestRsvp> {
    const user = requireRole(actor, GUEST_AREA_READER_ROLES);
    if (isViewer(user)) return VIEWER_GUEST_RSVP;
    if (user.role === "guest" && user.guestId !== guestId) throw new ForbiddenError();
    const guestRsvp = await rsvpRepository.findGuestRsvp(guestId);
    if (!guestRsvp) throw new RsvpGuestNotFoundError();
    return guestRsvp;
  };
}
