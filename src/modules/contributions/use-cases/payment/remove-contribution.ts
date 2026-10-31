import { requireRole } from "@/modules/auth/authorization";
import type { SessionUser } from "@/modules/auth/types";
import { ContributionNotFoundError } from "@/modules/contributions/errors";
import type { ContributionRepository } from "@/modules/contributions/repositories/contracts/contribution-repository";
import type { Contribution } from "@/modules/contributions/types";

type Dependencies = { contributionRepository: ContributionRepository };

export function makeRemoveContribution({ contributionRepository }: Dependencies) {
  return async function removeContribution(
    actor: SessionUser | null,
    contributionId: string,
  ): Promise<Contribution> {
    requireRole(actor, ["admin", "couple"]);
    const removed = await contributionRepository.remove(contributionId);
    if (!removed) throw new ContributionNotFoundError();
    return removed;
  };
}
