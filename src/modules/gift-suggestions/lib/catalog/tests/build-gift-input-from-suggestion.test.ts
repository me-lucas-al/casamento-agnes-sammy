import { describe, expect, it } from "vitest";
import { hydrateVerifiedProducts } from "@/modules/gift-suggestions/data/verified/hydrate-verified-products";
import { HONEYMOON_SUGGESTIONS } from "@/modules/gift-suggestions/data/honeymoon-suggestions";
import { buildGiftInputFromSuggestion } from "../build-gift-input-from-suggestion";

describe("buildGiftInputFromSuggestion", () => {
  it("copies product link, image, store, price date and exact price", () => {
    const [suggestion] = hydrateVerifiedProducts("cozinha", [
      {
        id: "cozinha-air-fryer",
        name: "Air Fryer",
        description: "Crocante.",
        type: "eletroportatil",
        productUrl: "https://www.amazon.com.br/dp/B0ABC",
        imageUrl: "https://m.media-amazon.com/images/I/a.jpg",
        priceCents: 34990,
        mode: "single",
        checkedAt: "2026-11-01",
      },
    ]);

    expect(buildGiftInputFromSuggestion(suggestion, "category-id")).toMatchObject({
      priceCents: 34990,
      productUrl: "https://www.amazon.com.br/dp/B0ABC",
      externalImageUrl: "https://m.media-amazon.com/images/I/a.jpg",
      storeName: "Amazon",
      priceCheckedAt: "2026-11-01",
    });
  });

  it("leaves product fields empty for suggestions without a product", () => {
    const input = buildGiftInputFromSuggestion(HONEYMOON_SUGGESTIONS[0], "category-id");
    expect(input).toMatchObject({ productUrl: null, externalImageUrl: null, storeName: null, priceCheckedAt: null });
  });
});
