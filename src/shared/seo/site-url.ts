const FALLBACK_SITE_URL = "http://localhost:3000";

export function resolveSiteUrl(appUrl: string | undefined): URL {
  if (!appUrl) return new URL(FALLBACK_SITE_URL);
  try {
    return new URL(appUrl);
  } catch {
    return new URL(FALLBACK_SITE_URL);
  }
}
