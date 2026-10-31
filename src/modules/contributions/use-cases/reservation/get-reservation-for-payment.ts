import type { SessionUser } from "@/modules/auth/types";
import { ContributionNotFoundError, ContributionNotPendingError } from "@/modules/contributions/errors";
import { requireGuestId } from "@/modules/contributions/lib/reservation/require-guest-id";
import type { ContributionRepository } from "@/modules/contributions/repositories/contracts/contribution-repository";
import type { Clock, Contribution } from "@/modules/contributions/types";

type Dependencies = { contributionRepository: ContributionRepository; clock: Clock };

export function makeGetReservationForPayment({ contributionRepository, clock }: Dependencies) {
  return async function getReservationForPayment(
    actor: SessionUser | null,
    contributionId: string,
  ): Promise<Contribution> {
    const guestId = requireGuestId(actor);
    const contribution = await contributionRepository.findById(contributionId);
    if (!contribution || contribution.guestId !== guestId) throw new ContributionNotFoundError();
    const isOpen = contribution.status === "reserved" && contribution.expiresAt > clock();
    if (!isOpen) throw new ContributionNotPendingError();
    return contribution;
  };
}
