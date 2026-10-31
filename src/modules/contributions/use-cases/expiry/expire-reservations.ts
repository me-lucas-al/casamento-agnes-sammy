import type { ContributionRepository } from "@/modules/contributions/repositories/contracts/contribution-repository";
import type { Clock } from "@/modules/contributions/types";

type Dependencies = { contributionRepository: ContributionRepository; clock: Clock };

export function makeExpireReservations({ contributionRepository, clock }: Dependencies) {
  return async function expireReservations(): Promise<number> {
    return contributionRepository.expireDue(clock());
  };
}
