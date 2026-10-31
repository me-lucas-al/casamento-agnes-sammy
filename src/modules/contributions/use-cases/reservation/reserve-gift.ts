import type { SessionUser } from "@/modules/auth/types";
import { addHours } from "@/shared/lib/dates";
import { GiftUnavailableError, TooManyActiveReservationsError } from "@/modules/contributions/errors";
import { requireGuestId } from "@/modules/contributions/lib/reservation/require-guest-id";
import { MAX_ACTIVE_RESERVATIONS_PER_GUEST, RESERVATION_HOURS } from "@/modules/contributions/lib/reservation/reservation-window";
import { resolveReservation } from "@/modules/contributions/lib/reservation/resolve-reservation";
import type { ReservationUnitOfWork } from "@/modules/contributions/repositories/contracts/reservation-unit-of-work";
import type { Clock, Contribution, ReservationRequest } from "@/modules/contributions/types";

type Dependencies = { unitOfWork: ReservationUnitOfWork; clock: Clock };

export function makeReserveGift({ unitOfWork, clock }: Dependencies) {
  return async function reserveGift(
    actor: SessionUser | null,
    request: ReservationRequest,
  ): Promise<Contribution> {
    const guestId = requireGuestId(actor);
    const now = clock();
    return unitOfWork.run(async (store) => {
      const gift = await store.lockReservableGift(request.giftId);
      if (!gift || !gift.isVisible) throw new GiftUnavailableError();
      const activeReservations = await store.countActiveReservations(guestId, now);
      if (activeReservations >= MAX_ACTIVE_RESERVATIONS_PER_GUEST) {
        throw new TooManyActiveReservationsError(MAX_ACTIVE_RESERVATIONS_PER_GUEST);
      }
      const commitment = await store.findCommitment(gift.id, now);
      const amounts = resolveReservation(gift, commitment, request);
      return store.insertReservation({
        ...amounts,
        anonymous: request.anonymous ?? false,
        giftId: gift.id,
        guestId,
        expiresAt: addHours(now, RESERVATION_HOURS),
      });
    });
  };
}
