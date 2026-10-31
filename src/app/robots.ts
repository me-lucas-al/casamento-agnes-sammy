import type { MetadataRoute } from "next";
import { buildRobotsRules } from "@/shared/seo/metadata/robots-rules";

export default function robots(): MetadataRoute.Robots {
  return buildRobotsRules();
}
