import { requireRole } from "@/modules/auth/authorization";
import type { SessionUser } from "@/modules/auth/types";
import { GiftNotFoundError } from "@/modules/gifts/errors";
import { GIFT_MANAGER_ROLES } from "@/modules/gifts/lib/roles/gift-roles";
import type { GiftRepository } from "@/modules/gifts/repositories/contracts/gift-repository";
import type { Gift } from "@/modules/gifts/types";

type Dependencies = { giftRepository: GiftRepository };

export function makeGetGiftForEdit({ giftRepository }: Dependencies) {
  return async function getGiftForEdit(actor: SessionUser | null, giftId: string): Promise<Gift> {
    requireRole(actor, GIFT_MANAGER_ROLES);
    const gift = await giftRepository.findById(giftId);
    if (!gift) throw new GiftNotFoundError();
    return gift;
  };
}
