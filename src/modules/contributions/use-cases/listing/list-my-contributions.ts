import type { SessionUser } from "@/modules/auth/types";
import { requireGuestId } from "@/modules/contributions/lib/reservation/require-guest-id";
import type { ContributionRepository } from "@/modules/contributions/repositories/contracts/contribution-repository";
import type { ContributionWithGift } from "@/modules/contributions/types";

type Dependencies = { contributionRepository: ContributionRepository };

export function makeListMyContributions({ contributionRepository }: Dependencies) {
  return async function listMyContributions(
    actor: SessionUser | null,
  ): Promise<ContributionWithGift[]> {
    const guestId = requireGuestId(actor);
    return contributionRepository.listByGuest(guestId);
  };
}
