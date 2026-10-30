import { requireRole } from "@/modules/auth/authorization";
import type { SessionUser } from "@/modules/auth/types";
import { GuestHasConfirmedContributionsError, GuestNotFoundError } from "../errors";
import type { GuestRepository } from "../repositories/guest-repository";

type Dependencies = { guestRepository: GuestRepository };

export function makeDeleteGuest({ guestRepository }: Dependencies) {
  return async function deleteGuest(actor: SessionUser | null, guestId: string): Promise<void> {
    requireRole(actor, ["admin", "couple"]);
    const guest = await guestRepository.findById(guestId);
    if (!guest) throw new GuestNotFoundError();
    if (await guestRepository.hasConfirmedContributions(guestId)) {
      throw new GuestHasConfirmedContributionsError();
    }
    await guestRepository.delete(guestId);
  };
}
