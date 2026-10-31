import type { GiftAvailability, GiftCommitment, ReservableGift } from "@/modules/contributions/types";

export function calculateAvailability(
  gift: ReservableGift,
  commitment: GiftCommitment,
): GiftAvailability {
  const { committedQuotas, committedAmountCents, committedCount } = commitment;
  const remainingAmountCents = Math.max(0, gift.priceCents - committedAmountCents);
  if (gift.mode === "single") {
    const isComplete = committedCount > 0;
    return {
      isComplete,
      remainingQuotas: null,
      remainingAmountCents: isComplete ? 0 : gift.priceCents,
      committedQuotas,
    };
  }
  if (gift.mode === "fixed_quotas") {
    const remainingQuotas = Math.max(0, (gift.totalQuotas ?? 0) - committedQuotas);
    return { isComplete: remainingQuotas === 0, remainingQuotas, remainingAmountCents, committedQuotas };
  }
  return {
    isComplete: remainingAmountCents === 0,
    remainingQuotas: null,
    remainingAmountCents,
    committedQuotas,
  };
}
