import type { giftContributions } from "@/shared/db/schema";

export type Contribution = typeof giftContributions.$inferSelect;

export type ContributionStatus = Contribution["status"];

export const CONTRIBUTION_STATUSES = ["reserved", "confirmed", "cancelled", "expired"] as const;

export type Clock = () => Date;

export type GiftMode = "single" | "fixed_quotas" | "free_amount";

export type ReservableGift = {
  id: string;
  name: string;
  description: string;
  imageUrl: string | null;
  priceCents: number;
  mode: GiftMode;
  totalQuotas: number | null;
  minAmountCents: number | null;
  isVisible: boolean;
};

export type GiftCommitment = {
  committedQuotas: number;
  committedAmountCents: number;
  committedCount: number;
};

export type GiftAvailability = {
  isComplete: boolean;
  remainingQuotas: number | null;
  remainingAmountCents: number;
  committedQuotas: number;
};

export type GiftReservationView = {
  gift: ReservableGift;
  availability: GiftAvailability;
};

export type ReservationRequest = {
  giftId: string;
  quotas?: number;
  amountCents?: number;
  anonymous?: boolean;
};

export type ReservationAmounts = {
  quotas: number | null;
  amountCents: number;
};

export type ReservationChange = ReservationAmounts & { anonymous: boolean };

export type NewReservation = ReservationChange & {
  giftId: string;
  guestId: string;
  expiresAt: Date;
};

export type ContributionWithGift = Contribution & {
  giftName: string;
  giftImageUrl: string | null;
};

export type PendingPaymentRow = Contribution & {
  giftName: string;
  guestName: string;
};

export const PAYMENT_SORTS = ["newest", "oldest", "amount", "expires"] as const;

export type PaymentSort = (typeof PAYMENT_SORTS)[number];

export type PaymentStatusFilter = ContributionStatus | "all";

export type PendingPaymentsQuery = {
  limit: number;
  offset: number;
  status: PaymentStatusFilter;
  search: string;
  sort: PaymentSort;
};

export type PendingPaymentsPage = {
  items: PendingPaymentRow[];
  total: number;
};

export type ConfirmationInput = {
  contributionId: string;
  confirmedBy: string;
  confirmedAt: Date;
  message?: string;
};
