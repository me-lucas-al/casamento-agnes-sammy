import { describe, expect, it } from "vitest";
import { validateCatalog } from "@/modules/gift-suggestions/lib/catalog/validate-catalog";
import { hydrateVerifiedProducts } from "../hydrate-verified-products";

describe("hydrateVerifiedProducts", () => {
  it("builds a suggestion that passes catalog validation", () => {
    const suggestions = hydrateVerifiedProducts("quarto-banho", [
      {
        id: "quarto-banho-jogo-de-cama",
        name: "Jogo de cama queen",
        description: "Noites macias.",
        type: "cama-banho",
        productUrl: "https://www.camicado.com.br/jogo-de-cama/p",
        imageUrl: "https://res.cloudinary.com/demo/cama.jpg",
        priceCents: 28990,
        mode: "single",
        checkedAt: "2026-11-01",
      },
    ]);

    expect(suggestions[0]).toMatchObject({ store: "camicado", storeName: "Camicado", priceBand: "100-300", kind: "item" });
    expect(validateCatalog(suggestions)).toEqual([]);
  });
});
