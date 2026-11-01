import { describe, expect, it } from "vitest";
import { GIFT_SUGGESTION_CATALOG } from "@/modules/gift-suggestions/data/gift-suggestion-catalog";
import type { GiftSuggestion } from "@/modules/gift-suggestions/types";
import { ALLOWED_IMAGE_HOSTS } from "@/shared/lib/images/allowed-image-hosts";
import { validateCatalog } from "../validate-catalog";

const product: GiftSuggestion = {
  id: "cozinha-air-fryer-x",
  categoryKey: "cozinha",
  categoryName: "Cozinha & Eletrodomésticos",
  name: "Air Fryer X",
  description: "Para jantares crocantes.",
  kind: "item",
  mode: "single",
  type: "eletroportatil",
  priceCents: 34990,
  priceBand: "300-600",
  store: "magazine-luiza",
  storeSearchUrl: null,
  productUrl: "https://www.magazineluiza.com.br/air-fryer-x/p/abc/",
  imageUrl: "https://res.cloudinary.com/demo/air-fryer.jpg",
  storeName: "Magazine Luiza",
  priceCheckedAt: "2026-11-01",
  tags: ["air", "fryer"],
};

const problemsOf = (overrides: Partial<GiftSuggestion>) => validateCatalog([{ ...product, ...overrides }]);

describe("validateCatalog for products", () => {
  it("accepts a verified product with an exact price", () => {
    expect(validateCatalog([product])).toEqual([]);
  });

  it("flags urls outside allowed stores, insecure urls and tracking params", () => {
    expect(problemsOf({ productUrl: "https://www.shopee.com.br/x" })[0]).toContain("allowed store host");
    expect(problemsOf({ productUrl: "http://www.magazineluiza.com.br/x" })[0]).toContain("allowed store host");
    expect(problemsOf({ productUrl: "https://www.magazineluiza.com.br/x?utm_source=a" })[0]).toContain("tracking");
  });

  it("flags store names, images, prices and dates that do not hold up", () => {
    expect(problemsOf({ storeName: "Amazon" })[0]).toContain("store name");
    expect(problemsOf({ imageUrl: "https://evil.example/a.jpg" })[0]).toContain("image host");
    expect(problemsOf({ imageUrl: null })[0]).toContain("image host");
    expect(problemsOf({ priceCents: 0 })[0]).toContain("positive integer");
    expect(problemsOf({ priceCents: 100.5 })[0]).toContain("positive integer");
    expect(problemsOf({ priceCheckedAt: "2026-13-40" })[0]).toContain("date");
    expect(problemsOf({ priceCheckedAt: null })[0]).toContain("date");
  });

  it("flags invalid modes and duplicated product urls", () => {
    expect(problemsOf({ mode: "fixed_quotas", totalQuotas: 12 })[0]).toContain("quota count");
    expect(problemsOf({ mode: "free_amount", minAmountCents: 100 })[0]).toContain("mode");
    const other = { ...product, id: "cozinha-outro", name: "Outro" };
    expect(validateCatalog([product, other])).toContain(`duplicated product url ${product.productUrl}`);
  });

  it("requires product data to come with a product url", () => {
    expect(problemsOf({ productUrl: null, store: null, imageUrl: "https://res.cloudinary.com/a.jpg" }).join()).toContain("require a product url");
  });
});

const MANUAL_ALLOWED_IMAGE_HOSTS = [
  "imagensra.tokstok.com.br",
  "images.kabum.com.br",
  "m.media-amazon.com",
  "res.cloudinary.com",
];

describe("shipped product catalog", () => {
  const products = GIFT_SUGGESTION_CATALOG.filter((suggestion) => suggestion.productUrl !== null);

  it("keeps the image host allowlist hand-maintained", () => {
    expect([...ALLOWED_IMAGE_HOSTS].sort()).toEqual(MANUAL_ALLOWED_IMAGE_HOSTS);
  });

  it("keeps every product on an allowed image host with a real price date", () => {
    for (const { id, imageUrl, priceCheckedAt, priceCents } of products) {
      expect(MANUAL_ALLOWED_IMAGE_HOSTS, id).toContain(new URL(imageUrl ?? "https://invalid.invalid").hostname);
      expect(priceCheckedAt, id).toMatch(/^\d{4}-\d{2}-\d{2}$/);
      expect(Number.isInteger(priceCents) && priceCents > 0, id).toBe(true);
    }
  });
});
