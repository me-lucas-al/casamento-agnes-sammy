import { requireRole } from "@/modules/auth/authorization";
import type { SessionUser } from "@/modules/auth/types";
import { RsvpGuestNotFoundError } from "../errors";
import type { RsvpRepository } from "../repositories/rsvp-repository";

type Dependencies = { rsvpRepository: RsvpRepository };

export function makeDeleteRsvp({ rsvpRepository }: Dependencies) {
  return async function deleteRsvp(actor: SessionUser | null, guestId: string): Promise<void> {
    requireRole(actor, ["admin", "couple"]);
    const guestRsvp = await rsvpRepository.findGuestRsvp(guestId);
    if (!guestRsvp) throw new RsvpGuestNotFoundError();
    await rsvpRepository.remove(guestId);
  };
}
