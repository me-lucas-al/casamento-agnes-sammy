import { getDatabase } from "@/shared/db/client";
import type { Database } from "@/shared/db/types";
import { createDrizzleContributionRepository } from "./repositories/drizzle-contribution-repository";
import { createDrizzleReservationUnitOfWork } from "./repositories/drizzle-reservation-unit-of-work";
import { makeCancelOwnReservation } from "./use-cases/cancel-own-reservation";
import { makeConfirmPixPayment } from "./use-cases/confirm-pix-payment";
import { makeExpireReservations } from "./use-cases/expire-reservations";
import { makeGetGiftAvailability } from "./use-cases/get-gift-availability";
import { makeGetReservationForPayment } from "./use-cases/get-reservation-for-payment";
import { makeListMyContributions } from "./use-cases/list-my-contributions";
import { makeListPendingPayments } from "./use-cases/list-pending-payments";
import { makeRejectOrCancelByCouple } from "./use-cases/reject-or-cancel-by-couple";
import { makeRemoveContribution } from "./use-cases/remove-contribution";
import { makeReserveGift } from "./use-cases/reserve-gift";
import { makeUpdateReservation } from "./use-cases/update-reservation";
import type { Clock } from "./types";

const systemClock: Clock = () => new Date();

export function createContributionModule(database: Database, clock: Clock = systemClock) {
  const contributionRepository = createDrizzleContributionRepository(database);
  const unitOfWork = createDrizzleReservationUnitOfWork(database);
  return {
    contributionRepository,
    reserveGift: makeReserveGift({ unitOfWork, clock }),
    updateReservation: makeUpdateReservation({ unitOfWork, clock }),
    cancelOwnReservation: makeCancelOwnReservation({ contributionRepository }),
    confirmPixPayment: makeConfirmPixPayment({ unitOfWork, clock }),
    rejectOrCancelByCouple: makeRejectOrCancelByCouple({ contributionRepository }),
    removeContribution: makeRemoveContribution({ contributionRepository }),
    expireReservations: makeExpireReservations({ contributionRepository, clock }),
    listMyContributions: makeListMyContributions({ contributionRepository }),
    listPendingPayments: makeListPendingPayments({ contributionRepository }),
    getGiftAvailability: makeGetGiftAvailability({ contributionRepository, clock }),
    getReservationForPayment: makeGetReservationForPayment({ contributionRepository, clock }),
  };
}

export type ContributionModule = ReturnType<typeof createContributionModule>;

export function getContributionModule(): ContributionModule {
  return createContributionModule(getDatabase());
}
