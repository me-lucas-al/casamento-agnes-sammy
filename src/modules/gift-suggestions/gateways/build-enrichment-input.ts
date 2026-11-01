import type { Gift, GiftInput } from "@/modules/gifts/types";

export function buildEnrichmentInput(current: Gift, suggestionInput: GiftInput): GiftInput {
  return {
    ...suggestionInput,
    categoryId: current.categoryId,
    kind: current.kind,
    name: current.name,
    description: current.description,
    isVisible: current.isVisible,
    sortOrder: current.sortOrder,
  };
}

export function keepCurrentPricing(current: Gift, input: GiftInput): GiftInput {
  return {
    ...input,
    priceCents: current.priceCents,
    mode: current.mode,
    totalQuotas: current.totalQuotas,
    minAmountCents: current.minAmountCents,
  };
}
