import { describe, expect, it } from "vitest";
import type { GiftImage } from "@/modules/gifts/types";
import { resolveGiftImageUrl } from "../resolve-gift-image-url";
import { resolveGiftImages, type ResolvedGiftImages } from "../resolve-gift-images";

const uploaded: GiftImage = { url: "https://res.cloudinary.com/x/a.jpg", publicId: "gifts/a" };
const baseInput = {
  categoryId: "c", kind: "item" as const, name: "n", description: "", priceCents: 100,
  mode: "single" as const, isVisible: true, sortOrder: 0,
};
const empty: ResolvedGiftImages = { uploadedImage: null, externalImageUrl: null };

describe("resolveGiftImages", () => {
  it("keeps current images when the input says nothing", () => {
    const current = { uploadedImage: uploaded, externalImageUrl: null };
    expect(resolveGiftImages(baseInput, current)).toEqual(current);
  });

  it("replaces an upload with an external image and the other way around", () => {
    const external = "https://cdn.example/a.jpg";
    expect(resolveGiftImages({ ...baseInput, externalImageUrl: external }, { ...empty, uploadedImage: uploaded }))
      .toEqual({ uploadedImage: null, externalImageUrl: external });
    expect(resolveGiftImages({ ...baseInput, image: uploaded }, { ...empty, externalImageUrl: external }))
      .toEqual({ uploadedImage: uploaded, externalImageUrl: null });
  });

  it("clears images explicitly and rejects both at once", () => {
    expect(resolveGiftImages({ ...baseInput, image: null, externalImageUrl: null }, { uploadedImage: uploaded, externalImageUrl: null })).toEqual(empty);
    expect(() => resolveGiftImages({ ...baseInput, image: uploaded, externalImageUrl: "https://cdn.example/a.jpg" }, empty)).toThrow();
  });
});

describe("resolveGiftImageUrl", () => {
  it("prefers the uploaded image, then the external one", () => {
    expect(resolveGiftImageUrl({ imageUrl: "u", externalImageUrl: "e" })).toBe("u");
    expect(resolveGiftImageUrl({ imageUrl: null, externalImageUrl: "e" })).toBe("e");
    expect(resolveGiftImageUrl({ imageUrl: null, externalImageUrl: null })).toBeNull();
  });
});
