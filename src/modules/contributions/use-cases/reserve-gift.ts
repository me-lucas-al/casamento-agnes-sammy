import type { SessionUser } from "@/modules/auth/types";
import { addHours } from "@/shared/lib/dates";
import { GiftUnavailableError, TooManyActiveReservationsError } from "../errors";
import { requireGuestId } from "../lib/require-guest-id";
import { MAX_ACTIVE_RESERVATIONS_PER_GUEST, RESERVATION_HOURS } from "../lib/reservation-window";
import { resolveReservation } from "../lib/resolve-reservation";
import type { ReservationUnitOfWork } from "../repositories/reservation-unit-of-work";
import type { Clock, Contribution, ReservationRequest } from "../types";

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
        giftId: gift.id,
        guestId,
        expiresAt: addHours(now, RESERVATION_HOURS),
      });
    });
  };
}
