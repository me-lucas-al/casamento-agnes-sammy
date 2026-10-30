import type {
  ConfirmationInput,
  Contribution,
  GiftCommitment,
  NewReservation,
  ReservableGift,
  ReservationAmounts,
} from "../types";

export interface ReservationStore {
  lockReservableGift(giftId: string): Promise<ReservableGift | null>;
  findCommitment(
    giftId: string,
    now: Date,
    excludedContributionId?: string,
  ): Promise<GiftCommitment>;
  insertReservation(newReservation: NewReservation): Promise<Contribution>;
  findContribution(contributionId: string): Promise<Contribution | null>;
  countActiveReservations(guestId: string, now: Date): Promise<number>;
  confirmReservation(input: ConfirmationInput): Promise<Contribution | null>;
  updateAmounts(contributionId: string, amounts: ReservationAmounts): Promise<Contribution | null>;
}

export interface ReservationUnitOfWork {
  run<Result>(work: (store: ReservationStore) => Promise<Result>): Promise<Result>;
}
