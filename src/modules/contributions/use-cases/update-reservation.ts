import { requireRole } from "@/modules/auth/authorization";
import type { SessionUser } from "@/modules/auth/types";
import {
  ContributionNotFoundError,
  ContributionNotPendingError,
  GiftNotFoundError,
} from "../errors";
import { requireGuestId } from "../lib/require-guest-id";
import { resolveReservation } from "../lib/resolve-reservation";
import type { ReservationUnitOfWork } from "../repositories/reservation-unit-of-work";
import type { Clock, Contribution } from "../types";

type Dependencies = { unitOfWork: ReservationUnitOfWork; clock: Clock };

type Input = { contributionId: string; quotas?: number; amountCents?: number; anonymous?: boolean };

const EDITABLE_BY_STAFF = ["reserved", "confirmed"];

export function makeUpdateReservation({ unitOfWork, clock }: Dependencies) {
  return async function updateReservation(
    actor: SessionUser | null,
    { contributionId, ...request }: Input,
  ): Promise<Contribution> {
    const user = requireRole(actor, ["guest", "couple", "admin"]);
    const ownerGuestId = user.role === "guest" ? requireGuestId(user) : null;
    const now = clock();
    return unitOfWork.run(async (store) => {
      const existing = await store.findContribution(contributionId);
      if (!existing) throw new ContributionNotFoundError();
      if (ownerGuestId && existing.guestId !== ownerGuestId) throw new ContributionNotFoundError();
      const editableStatuses = ownerGuestId ? ["reserved"] : EDITABLE_BY_STAFF;
      if (!editableStatuses.includes(existing.status)) throw new ContributionNotPendingError();
      const gift = await store.lockReservableGift(existing.giftId);
      if (!gift) throw new GiftNotFoundError();
      const commitment = await store.findCommitment(gift.id, now, existing.id);
      const amounts = resolveReservation(gift, commitment, request);
      const updated = await store.updateAmounts(existing.id, {
        ...amounts,
        anonymous: request.anonymous ?? existing.anonymous,
      });
      if (!updated) throw new ContributionNotPendingError();
      return updated;
    });
  };
}
