import { formatCentsAsBrl } from "@/shared/lib/money/money";

export type PriceCheckOutcome =
  | { status: "match" }
  | { status: "mismatch"; foundCents: number }
  | { status: "no-price" }
  | { status: "unreachable"; reason: string };

export type PriceCheckEntry = {
  id: string;
  productUrl: string;
  expectedCents: number;
  outcome: PriceCheckOutcome;
};

export function classifyPrice(expectedCents: number, foundCents: number | null): PriceCheckOutcome {
  if (foundCents === null) return { status: "no-price" };
  return foundCents === expectedCents ? { status: "match" } : { status: "mismatch", foundCents };
}

function describeEntry({ id, productUrl, expectedCents, outcome }: PriceCheckEntry): string | null {
  if (outcome.status === "match") return null;
  const expected = formatCentsAsBrl(expectedCents);
  if (outcome.status === "mismatch") return `MISMATCH ${id}: catalog ${expected}, page ${formatCentsAsBrl(outcome.foundCents)} ${productUrl}`;
  if (outcome.status === "no-price") return `NO PRICE ${id}: page shows no readable price ${productUrl}`;
  return `UNREACHABLE ${id}: ${outcome.reason} ${productUrl}`;
}

export function buildPriceCheckReport(entries: readonly PriceCheckEntry[]): string {
  const problems = entries.flatMap((entry) => {
    const line = describeEntry(entry);
    return line ? [line] : [];
  });
  const matches = entries.filter((entry) => entry.outcome.status === "match").length;
  return [`checked ${entries.length} products, ${matches} match`, ...problems].join("\n");
}
