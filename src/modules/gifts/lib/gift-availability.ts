import type { Gift } from "../types";

export type AvailabilityState = "available" | "partial" | "complete";

export type GiftPricing = Pick<Gift, "id" | "mode" | "priceCents" | "totalQuotas">;

export type ContributionTotals = {
  quotas: number;
  amountCents: number;
  count: number;
};

export type GiftAvailability = {
  state: AvailabilityState;
  totalQuotas: number | null;
  takenQuotas: number;
  remainingQuotas: number | null;
  takenCents: number;
  remainingCents: number;
};

export const EMPTY_CONTRIBUTION_TOTALS: ContributionTotals = { quotas: 0, amountCents: 0, count: 0 };

function resolveState(isComplete: boolean, hasContributions: boolean): AvailabilityState {
  if (isComplete) return "complete";
  return hasContributions ? "partial" : "available";
}

function computeSingleAvailability(pricing: GiftPricing, totals: ContributionTotals): GiftAvailability {
  const isTaken = totals.count > 0;
  return {
    state: isTaken ? "complete" : "available",
    totalQuotas: null,
    takenQuotas: 0,
    remainingQuotas: null,
    takenCents: isTaken ? pricing.priceCents : 0,
    remainingCents: isTaken ? 0 : pricing.priceCents,
  };
}

function computeQuotaAvailability(pricing: GiftPricing, totals: ContributionTotals): GiftAvailability {
  const totalQuotas = pricing.totalQuotas ?? 0;
  const takenQuotas = Math.min(totalQuotas, totals.quotas);
  const remainingQuotas = totalQuotas - takenQuotas;
  const takenCents = Math.min(pricing.priceCents, totals.amountCents);
  return {
    state: resolveState(remainingQuotas === 0, takenQuotas > 0),
    totalQuotas,
    takenQuotas,
    remainingQuotas,
    takenCents,
    remainingCents: remainingQuotas === 0 ? 0 : pricing.priceCents - takenCents,
  };
}

function computeFreeAmountAvailability(pricing: GiftPricing, totals: ContributionTotals): GiftAvailability {
  const takenCents = Math.min(pricing.priceCents, totals.amountCents);
  const remainingCents = pricing.priceCents - takenCents;
  return {
    state: resolveState(remainingCents === 0, takenCents > 0),
    totalQuotas: null,
    takenQuotas: 0,
    remainingQuotas: null,
    takenCents,
    remainingCents,
  };
}

export function computeGiftAvailability(pricing: GiftPricing, totals: ContributionTotals): GiftAvailability {
  if (pricing.mode === "fixed_quotas") return computeQuotaAvailability(pricing, totals);
  if (pricing.mode === "free_amount") return computeFreeAmountAvailability(pricing, totals);
  return computeSingleAvailability(pricing, totals);
}
