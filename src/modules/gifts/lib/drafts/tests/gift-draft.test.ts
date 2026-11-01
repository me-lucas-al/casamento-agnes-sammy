import { describe, expect, it } from "vitest";
import type { Gift, GiftInput } from "@/modules/gifts/types";
import { buildGiftDraft } from "../gift-draft";

const AMAZON_URL = "https://www.amazon.com.br/dp/B0AAA";
const OTHER_AMAZON_URL = "https://www.amazon.com.br/dp/B0BBB";

const baseInput: GiftInput = {
  categoryId: "category-1",
  kind: "item",
  name: "Air Fryer",
  description: "Para jantares crocantes.",
  priceCents: 34990,
  mode: "single",
  isVisible: true,
  sortOrder: 0,
};

const currentGift = {
  id: "gift-1",
  imageUrl: null,
  imagePublicId: null,
  externalImageUrl: null,
  productUrl: AMAZON_URL,
  storeName: "Amazon",
  priceCheckedAt: "2026-11-01",
} as Gift;

describe("buildGiftDraft price checked date", () => {
  it("resets the date when the product url changes and no date is sent", () => {
    const draft = buildGiftDraft({ ...baseInput, productUrl: OTHER_AMAZON_URL }, currentGift);
    expect(draft.priceCheckedAt).toBeNull();
  });

  it("uses the date sent together with a new product url", () => {
    const draft = buildGiftDraft({ ...baseInput, productUrl: OTHER_AMAZON_URL, priceCheckedAt: "2026-11-02" }, currentGift);
    expect(draft.priceCheckedAt).toBe("2026-11-02");
  });

  it("keeps the date when the product url is unchanged or not sent", () => {
    expect(buildGiftDraft({ ...baseInput, productUrl: AMAZON_URL }, currentGift).priceCheckedAt).toBe("2026-11-01");
    expect(buildGiftDraft(baseInput, currentGift).priceCheckedAt).toBe("2026-11-01");
  });

  it("clears every product field when the product url is removed", () => {
    const draft = buildGiftDraft({ ...baseInput, productUrl: null }, currentGift);
    expect(draft).toMatchObject({ productUrl: null, storeName: null, priceCheckedAt: null });
  });
});
