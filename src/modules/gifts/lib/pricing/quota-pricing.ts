import { splitCentsIntoQuotas } from "@/shared/lib/money";

export type QuotaPriceRange = {
  minCents: number;
  maxCents: number;
};

export function quotaPriceRange(priceCents: number, totalQuotas: number): QuotaPriceRange | null {
  const quotaPrices = splitCentsIntoQuotas(priceCents, totalQuotas);
  if (quotaPrices.length === 0) return null;
  return { minCents: Math.min(...quotaPrices), maxCents: Math.max(...quotaPrices) };
}

export function quotasAmountCents(priceCents: number, totalQuotas: number, quantity: number): number {
  const quotaPrices = splitCentsIntoQuotas(priceCents, totalQuotas);
  return quotaPrices.slice(0, quantity).reduce((sum, cents) => sum + cents, 0);
}
