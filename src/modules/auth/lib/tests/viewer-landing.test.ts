import { describe, expect, it } from "vitest";
import { resolveViewerLanding } from "../viewer-landing";

describe("resolveViewerLanding", () => {
  it("sends the visitor to the guest area or to the panel", () => {
    expect(resolveViewerLanding("convidado")).toBe("/inicio");
    expect(resolveViewerLanding("noivos")).toBe("/painel");
  });

  it("falls back to the guest area for anything else", () => {
    expect(resolveViewerLanding(undefined)).toBe("/inicio");
    expect(resolveViewerLanding("https://evil.example")).toBe("/inicio");
    expect(resolveViewerLanding(null)).toBe("/inicio");
  });
});
