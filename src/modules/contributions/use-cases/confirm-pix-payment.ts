import { requireRole } from "@/modules/auth/authorization";
import type { SessionUser } from "@/modules/auth/types";
import { ContributionNotFoundError, ContributionNotPendingError } from "../errors";
import type { ContributionRepository } from "../repositories/contribution-repository";
import type { Clock, Contribution } from "../types";

type Dependencies = { contributionRepository: ContributionRepository; clock: Clock };

type Input = { contributionId: string; message?: string };

export function makeConfirmPixPayment({ contributionRepository, clock }: Dependencies) {
  return async function confirmPixPayment(
    actor: SessionUser | null,
    { contributionId, message }: Input,
  ): Promise<Contribution> {
    const staff = requireRole(actor, ["admin", "couple"]);
    const existing = await contributionRepository.findById(contributionId);
    if (!existing) throw new ContributionNotFoundError();
    if (existing.status !== "reserved") throw new ContributionNotPendingError();
    const confirmed = await contributionRepository.confirm({
      contributionId,
      confirmedBy: staff.id,
      confirmedAt: clock(),
      message: message?.trim() || undefined,
    });
    if (!confirmed) throw new ContributionNotPendingError();
    return confirmed;
  };
}
