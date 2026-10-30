import { requireRole } from "@/modules/auth/authorization";
import type { SessionUser } from "@/modules/auth/types";
import { GiftNotFoundError } from "../errors";
import { calculateAvailability } from "../lib/gift-availability";
import type { ContributionRepository } from "../repositories/contribution-repository";
import type { Clock, GiftReservationView } from "../types";

type Dependencies = { contributionRepository: ContributionRepository; clock: Clock };

export function makeGetGiftAvailability({ contributionRepository, clock }: Dependencies) {
  return async function getGiftAvailability(
    actor: SessionUser | null,
    giftId: string,
  ): Promise<GiftReservationView> {
    const user = requireRole(actor, ["guest", "couple", "admin"]);
    const found = await contributionRepository.findGiftWithCommitment(giftId, clock());
    if (!found) throw new GiftNotFoundError();
    if (!found.gift.isVisible && user.role === "guest") throw new GiftNotFoundError();
    return { gift: found.gift, availability: calculateAvailability(found.gift, found.commitment) };
  };
}
