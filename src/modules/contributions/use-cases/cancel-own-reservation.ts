import type { SessionUser } from "@/modules/auth/types";
import { ContributionNotFoundError, ContributionNotPendingError } from "../errors";
import { requireGuestId } from "../lib/require-guest-id";
import type { ContributionRepository } from "../repositories/contribution-repository";
import type { Contribution } from "../types";

type Dependencies = { contributionRepository: ContributionRepository };

export function makeCancelOwnReservation({ contributionRepository }: Dependencies) {
  return async function cancelOwnReservation(
    actor: SessionUser | null,
    contributionId: string,
  ): Promise<Contribution> {
    const guestId = requireGuestId(actor);
    const existing = await contributionRepository.findById(contributionId);
    if (!existing || existing.guestId !== guestId) throw new ContributionNotFoundError();
    if (existing.status !== "reserved") throw new ContributionNotPendingError();
    const cancelled = await contributionRepository.cancel(contributionId, ["reserved"]);
    if (!cancelled) throw new ContributionNotPendingError();
    return cancelled;
  };
}
