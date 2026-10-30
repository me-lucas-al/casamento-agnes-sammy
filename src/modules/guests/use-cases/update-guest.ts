import { requireRole } from "@/modules/auth/authorization";
import type { SessionUser } from "@/modules/auth/types";
import { GuestNotFoundError } from "../errors";
import type { GuestRepository } from "../repositories/guest-repository";
import type { Guest, GuestDetails } from "../types";

type Dependencies = { guestRepository: GuestRepository };

export function makeUpdateGuest({ guestRepository }: Dependencies) {
  return async function updateGuest(
    actor: SessionUser | null,
    guestId: string,
    details: GuestDetails,
  ): Promise<Guest> {
    requireRole(actor, ["admin", "couple"]);
    const guest = await guestRepository.update(guestId, details);
    if (!guest) throw new GuestNotFoundError();
    return guest;
  };
}
