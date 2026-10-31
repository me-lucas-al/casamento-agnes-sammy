import type { Metadata } from "next";
import { resolveSiteUrl } from "./site-url";

export const SITE_NAME = "Agnes & Sammy";

export function buildSiteMetadata(appUrl: string | undefined): Metadata {
  return {
    metadataBase: resolveSiteUrl(appUrl),
    title: { default: SITE_NAME, template: `%s | ${SITE_NAME}` },
    description: "Site do casamento de Agnes e Sammy: lista de presentes, confirmação de presença, recados e fotos.",
    applicationName: SITE_NAME,
    robots: { index: false, follow: false },
    openGraph: {
      type: "website",
      locale: "pt_BR",
      siteName: SITE_NAME,
      title: `${SITE_NAME} vão se casar`,
      description: "Vem celebrar com a gente. Presentes, presença e recados em um só lugar.",
    },
    twitter: { card: "summary_large_image" },
  };
}
