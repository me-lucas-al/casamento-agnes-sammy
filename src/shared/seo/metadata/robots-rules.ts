import type { MetadataRoute } from "next";

export function buildRobotsRules(): MetadataRoute.Robots {
  return { rules: { userAgent: "*", disallow: "/" } };
}
