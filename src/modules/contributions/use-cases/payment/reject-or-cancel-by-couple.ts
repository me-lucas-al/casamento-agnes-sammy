import { requireRole } from "@/modules/auth/authorization";
import type { SessionUser } from "@/modules/auth/types";
import { ContributionNotFoundError, ContributionNotPendingError } from "@/modules/contributions/errors";
import type { ContributionRepository } from "@/modules/contributions/repositories/contracts/contribution-repository";
import type { Contribution } from "@/modules/contributions/types";

type Dependencies = { contributionRepository: ContributionRepository };

export function makeRejectOrCancelByCouple({ contributionRepository }: Dependencies) {
  return async function rejectOrCancelByCouple(
    actor: SessionUser | null,
    contributionId: string,
  ): Promise<Contribution> {
    requireRole(actor, ["admin", "couple"]);
    const existing = await contributionRepository.findById(contributionId);
    if (!existing) throw new ContributionNotFoundError();
    const cancelled = await contributionRepository.cancel(contributionId, ["reserved", "confirmed"]);
    if (!cancelled) throw new ContributionNotPendingError();
    return cancelled;
  };
}
