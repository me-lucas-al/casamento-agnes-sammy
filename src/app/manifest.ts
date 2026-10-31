import type { MetadataRoute } from "next";
import { buildWebManifest } from "@/shared/seo/metadata/web-manifest";

export default function manifest(): MetadataRoute.Manifest {
  return buildWebManifest();
}
