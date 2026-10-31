const JSON_LD_PATTERN = /<script[^>]*type=["']application\/ld\+json["'][^>]*>([\s\S]*?)<\/script>/gi;
const META_TAG_PATTERN = /<meta\b[^>]*>/gi;
const ATTRIBUTE_PATTERN = /([a-zA-Z:-]+)\s*=\s*("([^"]*)"|'([^']*)')/g;

type JsonRecord = Record<string, unknown>;

function isRecord(value: unknown): value is JsonRecord {
  return typeof value === "object" && value !== null && !Array.isArray(value);
}

function toCents(value: unknown): number | null {
  const amount = typeof value === "string" ? Number(value.replace(",", ".")) : value;
  if (typeof amount !== "number" || !Number.isFinite(amount) || amount <= 0) return null;
  return Math.round(amount * 100);
}

function collectNodes(value: unknown, nodes: JsonRecord[] = []): JsonRecord[] {
  if (Array.isArray(value)) value.forEach((item) => collectNodes(item, nodes));
  else if (isRecord(value)) {
    nodes.push(value);
    Object.values(value).forEach((item) => collectNodes(item, nodes));
  }
  return nodes;
}

function priceOfOffer(offer: JsonRecord): number | null {
  const currency = offer.priceCurrency;
  if (currency !== undefined && currency !== "BRL") return null;
  return toCents(offer.price ?? offer.lowPrice);
}

function extractFromJsonLd(html: string): number | null {
  for (const match of html.matchAll(JSON_LD_PATTERN)) {
    let parsed: unknown;
    try {
      parsed = JSON.parse(match[1].trim());
    } catch {
      continue;
    }
    for (const node of collectNodes(parsed)) {
      if (!("offers" in node)) continue;
      for (const offer of collectNodes(node.offers)) {
        const cents = priceOfOffer(offer);
        if (cents !== null) return cents;
      }
    }
  }
  return null;
}

function readMetaTags(html: string): Map<string, string> {
  const tags = new Map<string, string>();
  for (const tag of html.match(META_TAG_PATTERN) ?? []) {
    const attributes = new Map<string, string>();
    for (const attribute of tag.matchAll(ATTRIBUTE_PATTERN)) {
      attributes.set(attribute[1].toLowerCase(), attribute[3] ?? attribute[4] ?? "");
    }
    const key = attributes.get("property") ?? attributes.get("name");
    const content = attributes.get("content");
    if (key && content !== undefined) tags.set(key.toLowerCase(), content);
  }
  return tags;
}

function extractFromMeta(html: string): number | null {
  const tags = readMetaTags(html);
  const currency = tags.get("product:price:currency");
  if (currency !== undefined && currency !== "BRL") return null;
  return toCents(tags.get("product:price:amount"));
}

export function extractPagePriceCents(html: string): number | null {
  return extractFromJsonLd(html) ?? extractFromMeta(html);
}
