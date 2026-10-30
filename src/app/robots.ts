import type { MetadataRoute } from "next";
import { buildRobotsRules } from "@/shared/seo/robots-rules";

export default function robots(): MetadataRoute.Robots {
  return buildRobotsRules();
}
