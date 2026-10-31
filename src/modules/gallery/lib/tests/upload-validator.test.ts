import { describe, expect, it } from "vitest";
import { MAX_PHOTO_BYTES } from "../upload-rules";
import { findUploadViolation } from "../upload-validator";

describe("findUploadViolation", () => {
  it.each(["image/jpeg", "image/png", "image/webp"])("accepts %s", (mimeType) => {
    expect(findUploadViolation({ mimeType, sizeBytes: 1000 })).toBeNull();
  });

  it.each(["image/heic", "image/gif", "application/pdf", ""])("rejects mime %s", (mimeType) => {
    expect(findUploadViolation({ mimeType, sizeBytes: 1000 })).toBe("mime");
  });

  it("accepts exactly the size limit", () => {
    expect(findUploadViolation({ mimeType: "image/png", sizeBytes: MAX_PHOTO_BYTES })).toBeNull();
  });

  it.each([MAX_PHOTO_BYTES + 1, 0, -5, 1.5, Number.NaN])("rejects size %s", (sizeBytes) => {
    expect(findUploadViolation({ mimeType: "image/png", sizeBytes })).toBe("size");
  });
});
