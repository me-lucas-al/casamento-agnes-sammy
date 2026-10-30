import type { ContributionRepository } from "../repositories/contribution-repository";
import type { Clock } from "../types";

type Dependencies = { contributionRepository: ContributionRepository; clock: Clock };

export function makeExpireReservations({ contributionRepository, clock }: Dependencies) {
  return async function expireReservations(): Promise<number> {
    return contributionRepository.expireDue(clock());
  };
}
