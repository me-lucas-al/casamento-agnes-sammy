import { createHash } from "node:crypto";
import { describe, expect, it } from "vitest";
import { ALLOWED_UPLOAD_FORMATS, createCloudinaryClient, signParameters } from "../cloudinary";

describe("cloudinary client signing", () => {
  const client = createCloudinaryClient({
    cloudName: "demo",
    apiKey: "key",
    apiSecret: "secret",
    uploadPreset: "wedding_8mb",
  });

  it("signs allowed formats, public id, upload preset and timestamp", () => {
    const signed = client.signUpload("gallery/abc");
    const payload = `allowed_formats=jpg,png,webp&public_id=gallery/abc&timestamp=${signed.timestamp}&upload_preset=wedding_8mb`;

    expect(signed.allowedFormats).toBe(ALLOWED_UPLOAD_FORMATS);
    expect(signed.publicId).toBe("gallery/abc");
    expect(signed.uploadPreset).toBe("wedding_8mb");
    expect(signed.signature).toBe(createHash("sha1").update(`${payload}secret`).digest("hex"));
  });

  it("changes the signature when any signed parameter changes", () => {
    const first = signParameters({ public_id: "a", timestamp: 1 }, "secret");
    expect(signParameters({ public_id: "b", timestamp: 1 }, "secret")).not.toBe(first);
    expect(signParameters({ public_id: "a", timestamp: 2 }, "secret")).not.toBe(first);
  });

  it("exposes the cloud name", () => {
    expect(client.cloudName).toBe("demo");
  });
});
