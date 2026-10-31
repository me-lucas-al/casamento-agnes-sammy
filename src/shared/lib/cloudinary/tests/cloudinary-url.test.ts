import { describe, expect, it } from "vitest";
import { buildManagedPublicId, isManagedPublicId, urlReferencesCloudinaryAsset } from "../cloudinary-url";

const uuid = "123e4567-e89b-42d3-a456-426614174000";
const publicId = `gallery/${uuid}`;
const url = `https://res.cloudinary.com/demo/image/upload/v17/${publicId}.jpg`;
const reference = { url, publicId, cloudName: "demo" };

describe("managed public ids", () => {
  it("builds ids that pass validation for their folder only", () => {
    const built = buildManagedPublicId("gifts");

    expect(isManagedPublicId("gifts", built)).toBe(true);
    expect(isManagedPublicId("gallery", built)).toBe(false);
  });

  it.each([`gallery/${uuid}/x`, "gallery/abc", `gallery/${uuid}.jpg`, `other/${uuid}`, `gallery/../${uuid}`])(
    "rejects %s",
    (candidate) => {
      expect(isManagedPublicId("gallery", candidate)).toBe(false);
    },
  );
});

describe("urlReferencesCloudinaryAsset", () => {
  it("accepts the delivery url with and without version", () => {
    expect(urlReferencesCloudinaryAsset(reference)).toBe(true);
    expect(urlReferencesCloudinaryAsset({ ...reference, url: url.replace("v17/", "") })).toBe(true);
  });

  it.each([
    ["other host", `https://evil.com/demo/image/upload/v1/${publicId}.jpg`],
    ["lookalike host", `https://res.cloudinary.com.evil.com/demo/image/upload/v1/${publicId}.jpg`],
    ["other cloud", `https://res.cloudinary.com/other/image/upload/v1/${publicId}.jpg`],
    ["http", `http://res.cloudinary.com/demo/image/upload/v1/${publicId}.jpg`],
    ["credentials", `https://a:b@res.cloudinary.com/demo/image/upload/v1/${publicId}.jpg`],
    ["port", `https://res.cloudinary.com:444/demo/image/upload/v1/${publicId}.jpg`],
    ["video resource", `https://res.cloudinary.com/demo/video/upload/v1/${publicId}.jpg`],
    ["id in query", `https://evil.com/x?p=https://res.cloudinary.com/demo/image/upload/v1/${publicId}`],
    ["other id", `https://res.cloudinary.com/demo/image/upload/v1/gallery/${uuid.replace("1", "2")}.jpg`],
    ["id prefix only", `https://res.cloudinary.com/demo/image/upload/v1/${publicId}x/y.jpg`],
    ["extra trailing path", `https://res.cloudinary.com/demo/image/upload/v1/${publicId}/other.jpg`],
    ["not a url", "nope"],
  ])("rejects %s", (_label, candidate) => {
    expect(urlReferencesCloudinaryAsset({ ...reference, url: candidate })).toBe(false);
  });
});
