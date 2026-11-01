import { describe, expect, it } from "vitest";
import { isAllowedImageUrl } from "../image-host-rules";

describe("isAllowedImageUrl", () => {
  it("requires https and an allowed host", () => {
    expect(isAllowedImageUrl("https://cdn.example/a.jpg", ["cdn.example"])).toBe(true);
    expect(isAllowedImageUrl("http://cdn.example/a.jpg", ["cdn.example"])).toBe(false);
    expect(isAllowedImageUrl("https://other.example/a.jpg", ["cdn.example"])).toBe(false);
  });

  it.each([
    "https://user:x@m.media-amazon.com/a.jpg",
    "https://m.media-amazon.com:8443/a.jpg",
    "https://m.media-amazon.com@evil.com/a.jpg",
    "https://m.media-amazon.com.evil.com/a.jpg",
    "javascript:alert(1)",
    "data:image/png;base64,AAAA",
    "http://m.media-amazon.com/a.jpg",
  ])("rejects %s with the shipped allowlist", (url) => {
    expect(isAllowedImageUrl(url)).toBe(false);
  });

  it("accepts a plain shipped host", () => {
    expect(isAllowedImageUrl("https://m.media-amazon.com/images/I/a.jpg")).toBe(true);
  });
});
