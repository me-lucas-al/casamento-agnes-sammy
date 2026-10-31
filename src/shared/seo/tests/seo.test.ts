import { describe, expect, it } from "vitest";
import { formatLongDateInSaoPaulo } from "@/shared/lib/dates/dates";
import { buildRobotsRules } from "../metadata/robots-rules";
import { buildSiteMetadata } from "../metadata/site-metadata";
import { resolveSiteUrl } from "../metadata/site-url";
import { buildSocialCardCopy } from "../images/social-card-copy";
import { buildWebManifest } from "../metadata/web-manifest";

describe("site metadata", () => {
  const metadata = buildSiteMetadata("https://agnesesammy.com.br");

  it("keeps the site out of search engines", () => {
    expect(metadata.robots).toEqual({ index: false, follow: false });
  });

  it("uses a title template and a pt-BR description", () => {
    expect(metadata.title).toEqual({ default: "Agnes & Sammy", template: "%s | Agnes & Sammy" });
    expect(metadata.description).toContain("casamento");
    expect(metadata.openGraph).toMatchObject({ locale: "pt_BR", type: "website" });
    expect(metadata.twitter).toMatchObject({ card: "summary_large_image" });
  });

  it("resolves absolute urls against the configured app url", () => {
    expect(String(metadata.metadataBase)).toBe("https://agnesesammy.com.br/");
  });
});

describe("resolveSiteUrl", () => {
  it("falls back to localhost when the url is missing or invalid", () => {
    expect(resolveSiteUrl(undefined).href).toBe("http://localhost:3000/");
    expect(resolveSiteUrl("not a url").href).toBe("http://localhost:3000/");
  });
});

describe("social card copy", () => {
  it("formats the wedding date in Sao Paulo time", () => {
    const copy = buildSocialCardCopy({
      coupleNames: "Agnes & Sammy",
      eventAt: new Date("2026-11-07T22:00:00.000Z"),
      venueName: "Restaurante Fazenda",
    });
    expect(copy).toEqual({
      coupleNames: "Agnes & Sammy",
      dateText: "7 de novembro de 2026",
      venueText: "Restaurante Fazenda",
    });
  });

  it("does not shift the day when the instant is late in UTC", () => {
    expect(formatLongDateInSaoPaulo(new Date("2026-11-08T01:00:00.000Z"))).toBe("7 de novembro de 2026");
  });
});

describe("robots and manifest", () => {
  it("disallows every crawler", () => {
    expect(buildRobotsRules()).toEqual({ rules: { userAgent: "*", disallow: "/" } });
  });

  it("describes the installable site in pt-BR with the brand theme", () => {
    const manifest = buildWebManifest();
    expect(manifest).toMatchObject({ lang: "pt-BR", background_color: "#f6f1ea", theme_color: "#b83a6b" });
    expect(manifest.icons?.[0]).toMatchObject({ src: "/icon", sizes: "512x512" });
  });
});
