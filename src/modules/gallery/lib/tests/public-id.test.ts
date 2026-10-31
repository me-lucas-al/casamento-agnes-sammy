import { describe, expect, it } from "vitest";
import { isGalleryPublicId, urlReferencesPublicId } from "../public-id";

const uuid = "123e4567-e89b-42d3-a456-426614174000";

describe("isGalleryPublicId", () => {
  it("accepts server generated ids inside the gallery folder", () => {
    expect(isGalleryPublicId(`gallery/${uuid}`)).toBe(true);
  });

  it.each(["gifts/abc", "gallery/", "gallery", "gallery/abc", `gallery/${uuid}/b`, "gallery/../x", `/gallery/${uuid}`])(
    "rejects %s",
    (publicId) => {
      expect(isGalleryPublicId(publicId)).toBe(false);
    },
  );
});

describe("urlReferencesPublicId", () => {
  const publicId = `gallery/${uuid}`;
  const url = `https://res.cloudinary.com/demo/image/upload/v1/${publicId}.jpg`;

  it("accepts the cloudinary delivery url of the public id", () => {
    expect(urlReferencesPublicId(url, publicId, "demo")).toBe(true);
  });

  it("rejects other public ids, clouds, hosts and insecure urls", () => {
    expect(urlReferencesPublicId(url, "gallery/other", "demo")).toBe(false);
    expect(urlReferencesPublicId(url, publicId, "another")).toBe(false);
    expect(urlReferencesPublicId(url.replace("https", "http"), publicId, "demo")).toBe(false);
    expect(urlReferencesPublicId(url.replace("res.cloudinary.com", "evil.com"), publicId, "demo")).toBe(false);
  });
});
