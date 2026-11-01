import { describe, expect, it } from "vitest";
import { extractPagePriceCents, isBotChallengePage } from "../extract-page-price";
import { buildPriceCheckReport, classifyPrice } from "../price-check-report";

const jsonLd = (payload: unknown) =>
  `<html><head><script type="application/ld+json">${JSON.stringify(payload)}</script></head></html>`;

describe("extractPagePriceCents", () => {
  it("reads offers.price from a Product JSON-LD with BRL currency", () => {
    const html = jsonLd({ "@type": "Product", offers: { "@type": "Offer", price: "349.90", priceCurrency: "BRL" } });
    expect(extractPagePriceCents(html)).toBe(34990);
  });

  it("reads offers inside arrays and @graph nodes", () => {
    const html = jsonLd({ "@graph": [{ "@type": "WebSite" }, { "@type": "Product", offers: [{ price: 99.9, priceCurrency: "BRL" }] }] });
    expect(extractPagePriceCents(html)).toBe(9990);
  });

  it("ignores offers in other currencies and malformed JSON-LD", () => {
    expect(extractPagePriceCents(jsonLd({ offers: { price: 10, priceCurrency: "USD" } }))).toBeNull();
    expect(extractPagePriceCents('<script type="application/ld+json">{oops</script>')).toBeNull();
  });

  it("falls back to product:price:amount meta tags", () => {
    const html = '<meta property="product:price:amount" content="1299.00"><meta property="product:price:currency" content="BRL">';
    expect(extractPagePriceCents(html)).toBe(129900);
  });

  it("returns null when the page shows no price", () => {
    expect(extractPagePriceCents("<html><body>sem preco</body></html>")).toBeNull();
  });
});

describe("price check report", () => {
  it("classifies results and lists only the problems", () => {
    expect(classifyPrice(1000, 1000)).toEqual({ status: "match" });
    expect(classifyPrice(1000, 1200)).toEqual({ status: "mismatch", foundCents: 1200 });
    expect(classifyPrice(1000, null)).toEqual({ status: "no-price" });

    const report = buildPriceCheckReport([
      { id: "a", productUrl: "https://x/a", expectedCents: 1000, outcome: { status: "match" } },
      { id: "b", productUrl: "https://x/b", expectedCents: 1000, outcome: { status: "mismatch", foundCents: 1200 } },
      { id: "c", productUrl: "https://x/c", expectedCents: 1000, outcome: { status: "unreachable", reason: "HTTP 403" } },
    ]);

    expect(report).toContain("checked 3 products, 1 match");
    expect(report).toContain("MISMATCH b");
    expect(report).toContain("UNREACHABLE c: HTTP 403");
    expect(report).not.toContain("a:");
  });
});

describe("store visible prices", () => {
  it("prefers the visible Tok&Stok price over the Pix price in JSON-LD", () => {
    const html = `<script>{"simulationPrice":{"price":99.9,"oldPrice":99.9,"pixPrice":89.91}}</script>${jsonLd({ offers: { price: "89.91", priceCurrency: "BRL" } })}`;
    expect(extractPagePriceCents(html)).toBe(9990);
  });

  it("reads the Amazon displayed price in Brazilian format", () => {
    expect(extractPagePriceCents('<span class="a-offscreen">R$&nbsp;1.349,90</span>')).toBe(134990);
  });

  it("flags anti-bot pages that carry no price", () => {
    expect(isBotChallengePage("<html>Enter the characters you see below captcha</html>")).toBe(true);
    expect(isBotChallengePage('<span class="a-offscreen">R$ 10,00</span> captcha')).toBe(false);
  });
});
