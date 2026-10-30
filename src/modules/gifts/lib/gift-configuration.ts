import { InvalidGiftConfigurationError } from "../errors";
import type { GiftMode } from "../types";

export type GiftConfigurationInput = {
  mode: GiftMode;
  priceCents: number;
  totalQuotas?: number | null;
  minAmountCents?: number | null;
};

export type GiftConfiguration = {
  mode: GiftMode;
  priceCents: number;
  totalQuotas: number | null;
  minAmountCents: number | null;
};

const MAX_QUOTAS = 1000;

function fail(message: string): never {
  throw new InvalidGiftConfigurationError(message);
}

function normalizeFixedQuotas({ priceCents, totalQuotas }: GiftConfigurationInput): GiftConfiguration {
  if (!Number.isInteger(totalQuotas)) return fail("Informe o número de cotas.");
  const quotas = Number(totalQuotas);
  if (quotas < 2 || quotas > MAX_QUOTAS) return fail("O número de cotas deve ficar entre 2 e 1000.");
  if (quotas > priceCents) return fail("Cada cota precisa valer ao menos R$ 0,01.");
  return { mode: "fixed_quotas", priceCents, totalQuotas: quotas, minAmountCents: null };
}

function normalizeFreeAmount({ priceCents, minAmountCents }: GiftConfigurationInput): GiftConfiguration {
  if (!Number.isInteger(minAmountCents)) return fail("Informe o valor mínimo de contribuição.");
  const minimum = Number(minAmountCents);
  if (minimum < 1) return fail("O valor mínimo deve ser maior que zero.");
  if (minimum > priceCents) return fail("O valor mínimo não pode ser maior que o valor total.");
  return { mode: "free_amount", priceCents, totalQuotas: null, minAmountCents: minimum };
}

export function normalizeGiftConfiguration(input: GiftConfigurationInput): GiftConfiguration {
  if (!Number.isInteger(input.priceCents) || input.priceCents < 1) {
    return fail("O valor do presente deve ser maior que zero.");
  }
  if (input.mode === "fixed_quotas") return normalizeFixedQuotas(input);
  if (input.mode === "free_amount") return normalizeFreeAmount(input);
  return { mode: "single", priceCents: input.priceCents, totalQuotas: null, minAmountCents: null };
}
