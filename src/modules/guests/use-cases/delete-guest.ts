import { requireRole } from "@/modules/auth/authorization";
import type { SessionUser } from "@/modules/auth/types";
import { GuestHasConfirmedContributionsError, GuestNotFoundError } from "../errors";
import type { GuestRepository } from "../repositories/contracts/guest-repository";

type Dependencies = { guestRepository: GuestRepository };

export function makeDeleteGuest({ guestRepository }: Dependencies) {
  return async function deleteGuest(actor: SessionUser | null, guestId: string): Promise<void> {
    requireRole(actor, ["admin", "couple"]);
    const outcome = await guestRepository.deleteUnlessCommitted(guestId);
    if (outcome === "not_found") throw new GuestNotFoundError();
    if (outcome === "has_confirmed") throw new GuestHasConfirmedContributionsError();
  };
}
