import { GIFT_SUGGESTION_CATALOG } from "../src/modules/gift-suggestions/data/gift-suggestion-catalog";
import { extractPagePriceCents, isBotChallengePage } from "../src/modules/gift-suggestions/lib/price-check/extract-page-price";
import {
  buildPriceCheckReport,
  classifyPrice,
  type PriceCheckEntry,
  type PriceCheckOutcome,
} from "../src/modules/gift-suggestions/lib/price-check/price-check-report";

const REQUEST_DELAY_MS = 1500;
const REQUEST_TIMEOUT_MS = 10_000;
const USER_AGENT = "CasamentoAgnesSammyPriceCheck/1.0 (read-only price verification for a private wedding gift list)";

function parseLimit(): number {
  const limitArgument = process.argv.find((argument) => argument.startsWith("--limit="));
  const limit = Number(limitArgument?.split("=")[1]);
  return Number.isInteger(limit) && limit > 0 ? limit : Number.POSITIVE_INFINITY;
}

function wait(milliseconds: number): Promise<void> {
  return new Promise((resolve) => setTimeout(resolve, milliseconds));
}

async function checkProduct(productUrl: string, expectedCents: number): Promise<PriceCheckOutcome> {
  try {
    const response = await fetch(productUrl, {
      headers: { "User-Agent": USER_AGENT, Accept: "text/html" },
      signal: AbortSignal.timeout(REQUEST_TIMEOUT_MS),
    });
    if (response.status !== 200) return { status: "unreachable", reason: `HTTP ${response.status}` };
    const html = await response.text();
    if (isBotChallengePage(html)) return { status: "unreachable", reason: "blocked by anti-bot challenge" };
    return classifyPrice(expectedCents, extractPagePriceCents(html));
  } catch (error) {
    return { status: "unreachable", reason: error instanceof Error ? error.name : "request failed" };
  }
}

async function main() {
  const products = GIFT_SUGGESTION_CATALOG.filter((suggestion) => suggestion.productUrl !== null).slice(0, parseLimit());
  const entries: PriceCheckEntry[] = [];
  for (const [index, product] of products.entries()) {
    if (index > 0) await wait(REQUEST_DELAY_MS);
    const productUrl = product.productUrl ?? "";
    const outcome = await checkProduct(productUrl, product.priceCents);
    entries.push({ id: product.id, productUrl, expectedCents: product.priceCents, outcome });
  }
  console.log(buildPriceCheckReport(entries));
}

main();
