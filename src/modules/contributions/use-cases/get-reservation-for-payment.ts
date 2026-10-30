import type { SessionUser } from "@/modules/auth/types";
import { ContributionNotFoundError, ContributionNotPendingError } from "../errors";
import { requireGuestId } from "../lib/require-guest-id";
import type { ContributionRepository } from "../repositories/contribution-repository";
import type { Clock, Contribution } from "../types";

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
