import { requireRole } from "@/modules/auth/authorization";
import type { SessionUser } from "@/modules/auth/types";
import {
  ContributionNotFoundError,
  ContributionNotPendingError,
  GiftNotFoundError,
  GiftUnavailableError,
} from "../errors";
import { contributionStillFits } from "../lib/contribution-still-fits";
import type { ReservationUnitOfWork } from "../repositories/reservation-unit-of-work";
import type { Clock, Contribution } from "../types";

type Dependencies = { unitOfWork: ReservationUnitOfWork; clock: Clock };

type Input = { contributionId: string; message?: string };

export function makeConfirmPixPayment({ unitOfWork, clock }: Dependencies) {
  return async function confirmPixPayment(
    actor: SessionUser | null,
    { contributionId, message }: Input,
  ): Promise<Contribution> {
    const staff = requireRole(actor, ["admin", "couple"]);
    const now = clock();
    return unitOfWork.run(async (store) => {
      const existing = await store.findContribution(contributionId);
      if (!existing) throw new ContributionNotFoundError();
      if (existing.status !== "reserved") throw new ContributionNotPendingError();
      const gift = await store.lockReservableGift(existing.giftId);
      if (!gift) throw new GiftNotFoundError();
      const commitment = await store.findCommitment(gift.id, now, existing.id);
      if (!contributionStillFits(gift, commitment, existing)) throw new GiftUnavailableError();
      const confirmed = await store.confirmReservation({
        contributionId,
        confirmedBy: staff.id,
        confirmedAt: now,
        message: message?.trim() || undefined,
      });
      if (!confirmed) throw new ContributionNotPendingError();
      return confirmed;
    });
  };
}
