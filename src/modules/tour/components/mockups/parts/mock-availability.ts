import type { GiftAvailability } from "@/modules/gifts/lib/availability/gift-availability";

export function buildQuotaAvailability(totalQuotas: number, takenQuotas: number): GiftAvailability {
  const state = takenQuotas === 0 ? "available" : takenQuotas >= totalQuotas ? "complete" : "partial";
  return {
    state,
    totalQuotas,
    takenQuotas,
    remainingQuotas: totalQuotas - takenQuotas,
    takenCents: 0,
    remainingCents: 0,
  };
}

export function buildAmountAvailability(goalCents: number, takenCents: number): GiftAvailability {
  const state = takenCents === 0 ? "available" : takenCents >= goalCents ? "complete" : "partial";
  return {
    state,
    totalQuotas: null,
    takenQuotas: 0,
    remainingQuotas: null,
    takenCents,
    remainingCents: Math.max(goalCents - takenCents, 0),
  };
}
