import { describe, expect, it } from "vitest";
import { isGalleryPublicId, urlReferencesPublicId } from "./public-id";

describe("isGalleryPublicId", () => {
  it("accepts ids inside the gallery folder", () => {
    expect(isGalleryPublicId("gallery/abc_DEF-123")).toBe(true);
  });

  it.each(["gifts/abc", "gallery/", "gallery", "gallery/a/b", "gallery/../x", "xgallery/abc", "/gallery/abc"])(
    "rejects %s",
    (publicId) => {
      expect(isGalleryPublicId(publicId)).toBe(false);
    },
  );
});

describe("urlReferencesPublicId", () => {
  const url = "https://res.cloudinary.com/demo/image/upload/v1/gallery/abc.jpg";

  it("accepts https url containing the public id", () => {
    expect(urlReferencesPublicId(url, "gallery/abc")).toBe(true);
  });

  it("rejects other public ids and insecure urls", () => {
    expect(urlReferencesPublicId(url, "gallery/other")).toBe(false);
    expect(urlReferencesPublicId(url.replace("https", "http"), "gallery/abc")).toBe(false);
  });
});
