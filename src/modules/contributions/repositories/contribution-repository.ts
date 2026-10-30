import type {
  ConfirmationInput,
  Contribution,
  ContributionStatus,
  ContributionWithGift,
  GiftCommitment,
  PendingPaymentsPage,
  PendingPaymentsQuery,
  ReservableGift,
} from "../types";

export type GiftWithCommitment = {
  gift: ReservableGift;
  commitment: GiftCommitment;
};

export interface ContributionRepository {
  findById(contributionId: string): Promise<Contribution | null>;
  findGiftWithCommitment(giftId: string, now: Date): Promise<GiftWithCommitment | null>;
  cancel(
    contributionId: string,
    allowedStatuses: readonly ContributionStatus[],
  ): Promise<Contribution | null>;
  confirm(input: ConfirmationInput): Promise<Contribution | null>;
  remove(contributionId: string): Promise<Contribution | null>;
  expireDue(now: Date): Promise<number>;
  listByGuest(guestId: string): Promise<ContributionWithGift[]>;
  listPendingPage(query: PendingPaymentsQuery): Promise<PendingPaymentsPage>;
}
