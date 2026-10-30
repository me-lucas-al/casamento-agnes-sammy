import { describe, expect, it } from "vitest";
import { MAX_IMAGE_SIZE_BYTES, validateImageUpload } from "./image-upload-validator";

describe("validateImageUpload", () => {
  it.each(["image/jpeg", "image/png", "image/webp"])("accepts %s", (contentType) => {
    expect(validateImageUpload({ contentType, sizeBytes: 1024 })).toEqual({ valid: true });
  });

  it.each(["image/gif", "application/pdf", "image/svg+xml", ""])("rejects type %s", (contentType) => {
    expect(validateImageUpload({ contentType, sizeBytes: 1024 })).toEqual({ valid: false, reason: "type" });
  });

  it("accepts exactly 8MB and rejects above", () => {
    expect(validateImageUpload({ contentType: "image/png", sizeBytes: MAX_IMAGE_SIZE_BYTES }).valid).toBe(true);
    expect(validateImageUpload({ contentType: "image/png", sizeBytes: MAX_IMAGE_SIZE_BYTES + 1 })).toEqual({
      valid: false,
      reason: "size",
    });
  });

  it("rejects empty and invalid sizes", () => {
    expect(validateImageUpload({ contentType: "image/png", sizeBytes: 0 })).toEqual({ valid: false, reason: "empty" });
    expect(validateImageUpload({ contentType: "image/png", sizeBytes: Number.NaN }).valid).toBe(false);
  });
});
