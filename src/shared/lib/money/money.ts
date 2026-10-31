const CENTS_PER_REAL = 100;

const brlFormatter = new Intl.NumberFormat("pt-BR", {
  style: "currency",
  currency: "BRL",
});

export function formatCentsAsBrl(cents: number): string {
  return brlFormatter.format(cents / CENTS_PER_REAL);
}

export function isValidCents(value: number): boolean {
  return Number.isInteger(value) && value >= 0;
}

export function parseBrlToCents(text: string): number | null {
  const normalized = text
    .replace(/R\$/g, "")
    .replace(/\s/g, "")
    .replace(/\./g, "")
    .replace(",", ".");
  if (!/^\d+(\.\d{1,2})?$/.test(normalized)) return null;
  return Math.round(Number(normalized) * CENTS_PER_REAL);
}

export function splitCentsIntoQuotas(totalCents: number, quotas: number): number[] {
  if (quotas < 1) return [];
  const baseCents = Math.floor(totalCents / quotas);
  const remainder = totalCents - baseCents * quotas;
  return Array.from({ length: quotas }, (_, index) =>
    index < remainder ? baseCents + 1 : baseCents,
  );
}
