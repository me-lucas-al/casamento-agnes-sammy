import { getDatabase } from "@/shared/db/client";
import type { Database } from "@/shared/db/types";
import { createDrizzleContributionRepository } from "./repositories/drizzle/drizzle-contribution-repository";
import { createDrizzleReservationUnitOfWork } from "./repositories/drizzle/drizzle-reservation-unit-of-work";
import { makeCancelOwnReservation } from "./use-cases/reservation/cancel-own-reservation";
import { makeConfirmPixPayment } from "./use-cases/payment/confirm-pix-payment";
import { makeExpireReservations } from "./use-cases/expiry/expire-reservations";
import { makeGetGiftAvailability } from "./use-cases/listing/get-gift-availability";
import { makeGetReservationForPayment } from "./use-cases/reservation/get-reservation-for-payment";
import { makeListMyContributions } from "./use-cases/listing/list-my-contributions";
import { makeListPendingPayments } from "./use-cases/listing/list-pending-payments";
import { makeRejectOrCancelByCouple } from "./use-cases/payment/reject-or-cancel-by-couple";
import { makeRemoveContribution } from "./use-cases/payment/remove-contribution";
import { makeReserveGift } from "./use-cases/reservation/reserve-gift";
import { makeUpdateReservation } from "./use-cases/reservation/update-reservation";
import { createDrizzlePixSettingsRepository } from "@/modules/payments/repositories/drizzle/drizzle-pix-settings-repository";
import type { Clock, PixConfigurationChecker } from "./types";

const systemClock: Clock = () => new Date();

function createPixConfigurationChecker(database: Database): PixConfigurationChecker {
  const pixSettingsRepository = createDrizzlePixSettingsRepository(database);
  return async () => (await pixSettingsRepository.find()) !== null;
}

export function createContributionModule(
  database: Database,
  clock: Clock = systemClock,
  isPixConfigured: PixConfigurationChecker = createPixConfigurationChecker(database),
) {
  const contributionRepository = createDrizzleContributionRepository(database);
  const unitOfWork = createDrizzleReservationUnitOfWork(database);
  return {
    contributionRepository,
    isPixConfigured,
    reserveGift: makeReserveGift({ unitOfWork, clock, isPixConfigured }),
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
