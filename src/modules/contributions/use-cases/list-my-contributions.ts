import type { SessionUser } from "@/modules/auth/types";
import { requireGuestId } from "../lib/require-guest-id";
import type { ContributionRepository } from "../repositories/contribution-repository";
import type { ContributionWithGift } from "../types";

type Dependencies = { contributionRepository: ContributionRepository };

export function makeListMyContributions({ contributionRepository }: Dependencies) {
  return async function listMyContributions(
    actor: SessionUser | null,
  ): Promise<ContributionWithGift[]> {
    const guestId = requireGuestId(actor);
    return contributionRepository.listByGuest(guestId);
  };
}
