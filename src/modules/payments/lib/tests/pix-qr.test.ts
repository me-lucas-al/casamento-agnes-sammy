import { describe, expect, it } from "vitest";
import { renderPixQrSvgDataUrl } from "../pix-qr";

describe("renderPixQrSvgDataUrl", () => {
  it("returns an svg data url", async () => {
    const dataUrl = await renderPixQrSvgDataUrl("00020101021126");
    const svg = Buffer.from(dataUrl.replace("data:image/svg+xml;base64,", ""), "base64").toString();

    expect(dataUrl.startsWith("data:image/svg+xml;base64,")).toBe(true);
    expect(svg).toContain("<svg");
  });
});
