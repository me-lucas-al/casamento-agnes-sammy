import type { SessionUser } from "@/modules/auth/types";
import { ContributionNotFoundError, ContributionNotPendingError } from "@/modules/contributions/errors";
import { requireGuestId } from "@/modules/contributions/lib/reservation/require-guest-id";
import type { ContributionRepository } from "@/modules/contributions/repositories/contracts/contribution-repository";
import type { Contribution } from "@/modules/contributions/types";

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
