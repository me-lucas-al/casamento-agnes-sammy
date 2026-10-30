import type { MetadataRoute } from "next";
import { SITE_NAME } from "./site-metadata";

export function buildWebManifest(): MetadataRoute.Manifest {
  return {
    name: SITE_NAME,
    short_name: SITE_NAME,
    description: "Casamento de Agnes e Sammy",
    lang: "pt-BR",
    start_url: "/",
    display: "standalone",
    background_color: "#f6f1ea",
    theme_color: "#b83a6b",
    icons: [{ src: "/icon", sizes: "512x512", type: "image/png" }],
  };
}
