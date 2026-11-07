import { hasRole, requireRole } from "@/modules/auth/authorization";
import { GUEST_AREA_READER_ROLES } from "@/modules/auth/role-groups";
import type { SessionUser } from "@/modules/auth/types";
import { GiftNotFoundError } from "@/modules/contributions/errors";
import { calculateAvailability } from "@/modules/contributions/lib/availability/gift-availability";
import type { ContributionRepository } from "@/modules/contributions/repositories/contracts/contribution-repository";
import type { Clock, GiftReservationView } from "@/modules/contributions/types";

type Dependencies = { contributionRepository: ContributionRepository; clock: Clock };

export function makeGetGiftAvailability({ contributionRepository, clock }: Dependencies) {
  return async function getGiftAvailability(
    actor: SessionUser | null,
    giftId: string,
  ): Promise<GiftReservationView> {
    const user = requireRole(actor, GUEST_AREA_READER_ROLES);
    const found = await contributionRepository.findGiftWithCommitment(giftId, clock());
    if (!found) throw new GiftNotFoundError();
    if (!found.gift.isVisible && !hasRole(user, ["admin", "couple"])) throw new GiftNotFoundError();
    return { gift: found.gift, availability: calculateAvailability(found.gift, found.commitment) };
  };
}
