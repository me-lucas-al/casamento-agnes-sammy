import type { GiftCommitment, ReservableGift, ReservationAmounts } from "@/modules/contributions/types";
import { calculateAvailability } from "./gift-availability";

export function contributionStillFits(
  gift: ReservableGift,
  otherCommitments: GiftCommitment,
  contribution: ReservationAmounts,
): boolean {
  const availability = calculateAvailability(gift, otherCommitments);
  if (availability.isComplete) return false;
  if (gift.mode === "single") return true;
  if (gift.mode === "fixed_quotas") return (availability.remainingQuotas ?? 0) >= (contribution.quotas ?? 0);
  return availability.remainingAmountCents >= contribution.amountCents;
}
