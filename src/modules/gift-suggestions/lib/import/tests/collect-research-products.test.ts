import { describe, expect, it } from "vitest";
import { collectResearchProducts, type ResearchSource } from "../collect-research-products";
import { renderVerifiedDataFiles } from "../render-verified-data-files";
import { mapProductType } from "../map-product-type";
import { categoryKeyOfResearchFile } from "../research-file-category";

function rawProduct(overrides: Record<string, unknown> = {}) {
  return {
    id: "air-fryer-x",
    name: "Air Fryer X",
    description: "Para jantares crocantes.",
    type: "Eletroportátil",
    store: "Amazon",
    productUrl: "https://www.amazon.com.br/dp/B0AAA",
    imageUrl: "https://m.media-amazon.com/images/I/a.jpg",
    priceCents: 34990,
    kind: "item",
    mode: "single",
    evidence: "page",
    ...overrides,
  };
}

function sourceOf(products: unknown[]): ResearchSource {
  return { fileName: "cozinha-eletro.json", categoryKey: "cozinha", content: { checkedAt: "2026-11-01", products } };
}

const reasonsOf = (product: unknown) => collectResearchProducts([sourceOf([product])]).dropped.map((item) => item.reason);

describe("collectResearchProducts", () => {
  it("accepts a valid product and prefixes the id with the category key", () => {
    const { products, dropped } = collectResearchProducts([sourceOf([rawProduct()])]);

    expect(dropped).toEqual([]);
    expect(products[0].record).toMatchObject({ id: "cozinha-air-fryer-x", type: "eletroportatil", checkedAt: "2026-11-01" });
  });

  it("drops products with unsafe or inconsistent data and reports why", () => {
    expect(reasonsOf(rawProduct({ productUrl: "https://www.shopee.com.br/x", store: "Shopee" }))[0]).toContain("allowed store");
    expect(reasonsOf(rawProduct({ productUrl: "http://www.amazon.com.br/dp/B0AAA" }))[0]).toContain("allowed store");
    expect(reasonsOf(rawProduct({ productUrl: "https://www.amazon.com.br/dp/B0AAA?tag=x-20" }))[0]).toContain("tracking");
    expect(reasonsOf(rawProduct({ store: "Magazine Luiza" }))[0]).toContain("store does not match");
    expect(reasonsOf(rawProduct({ priceCents: 349.9 }))[0]).toContain("price");
    expect(reasonsOf(rawProduct({ priceCents: 0 }))[0]).toContain("price");
    expect(reasonsOf(rawProduct({ imageUrl: "http://m.media-amazon.com/a.jpg" }))[0]).toContain("https");
    expect(reasonsOf(rawProduct({ imageUrl: "https://ae01.alicdn.com/a.jpg" }))[0]).toContain("allowed image hosts");
    expect(reasonsOf(rawProduct({ imageUrl: "https://cdn.unlisted.example/a.jpg" }))[0]).toContain("allowed image hosts");
    expect(reasonsOf(rawProduct({ imageUrl: "https://user:x@m.media-amazon.com/a.jpg" }))[0]).toContain("allowed image hosts");
    expect(reasonsOf(rawProduct({ mode: "fixed_quotas" }))[0]).toContain("quota");
    expect(reasonsOf(rawProduct({ mode: "single", totalQuotas: 3 }))[0]).toContain("quotas");
    expect(reasonsOf({ id: "x" })[0]).toContain("invalid shape");
  });

  it("de-duplicates by id, product url and name", () => {
    const { products, dropped } = collectResearchProducts([
      sourceOf([
        rawProduct(),
        rawProduct({ name: "Outro nome", productUrl: "https://www.amazon.com.br/dp/B0BBB" }),
        rawProduct({ id: "outro-id", name: "Outro", productUrl: "https://www.amazon.com.br/dp/B0AAA/" }),
        rawProduct({ id: "id-3", name: "AIR fryer x", productUrl: "https://www.amazon.com.br/dp/B0CCC" }),
      ]),
    ]);

    expect(products).toHaveLength(1);
    expect(dropped.map((item) => item.reason).sort()).toEqual(["duplicated id", "duplicated name", "duplicated product url"]);
  });

  it("produces the same products whatever the order of files and products", () => {
    const first = sourceOf([rawProduct(), rawProduct({ id: "b", name: "B", productUrl: "https://www.amazon.com.br/dp/B0B" })]);
    const second = { ...sourceOf([rawProduct({ id: "c", name: "C", productUrl: "https://www.amazon.com.br/dp/B0C" })]), fileName: "cozinha-utensilios.json" };
    const forward = collectResearchProducts([first, second]);
    const reversed = collectResearchProducts([
      { ...second, content: second.content },
      { ...first, content: { checkedAt: "2026-11-01", products: [...(first.content as { products: unknown[] }).products].reverse() } },
    ]);

    expect(reversed.products).toEqual(forward.products);
  });

  it("reports files that do not match the research schema", () => {
    const { dropped } = collectResearchProducts([{ fileName: "x.json", categoryKey: "sala", content: { nope: true } }]);
    expect(dropped[0].reason).toContain("schema");
  });
});

describe("generated files", () => {
  const products = collectResearchProducts([
    sourceOf(
      Array.from({ length: 20 }, (_, index) =>
        rawProduct({
          id: `item-${index}`,
          name: `Produto ${index}`,
          productUrl: `https://www.amazon.com.br/dp/B0${index}`,
          imageUrl: `https://${index % 2 ? "images.kabum.com.br" : "m.media-amazon.com"}/${index}.jpg`,
        }),
      ),
    ),
  ]).products;

  it("chunks data so every file stays within 150 lines", () => {
    const files = renderVerifiedDataFiles(products);

    expect(files.length).toBeGreaterThan(3);
    for (const file of files) expect(file.content.split("\n").length, file.path).toBeLessThanOrEqual(150);
    expect(files.map((file) => file.path)).toContain("src/modules/gift-suggestions/data/verified/verified-suggestions.ts");
  });
});

describe("mapProductType and categoryKeyOfResearchFile", () => {
  it("maps labels with accents and falls back per category", () => {
    expect(mapProductType("Eletroportátil", "cozinha")).toBe("eletroportatil");
    expect(mapProductType("Jogo", "divertidos")).toBe("divertido");
    expect(mapProductType("Banho", "quarto-banho")).toBe("cama-banho");
    expect(mapProductType("Coisa", "sala")).toBe("decoracao");
  });

  it("maps research files to suggestion categories", () => {
    expect(categoryKeyOfResearchFile("cozinha-utensilios.json")).toBe("cozinha");
    expect(categoryKeyOfResearchFile("random.json")).toBeNull();
  });
});
