import { logger as defaultLogger, type Logger } from "@/shared/lib/logging/logger";
import { serializeError } from "@/shared/lib/logging/serialize-error";

const FALLBACK_SITE_URL = "http://localhost:3000";

export function resolveSiteUrl(appUrl: string | undefined, logger: Logger = defaultLogger): URL {
  if (!appUrl) return new URL(FALLBACK_SITE_URL);
  try {
    return new URL(appUrl);
  } catch (error) {
    logger.error("seo.invalid_app_url", { error: serializeError(error) });
    return new URL(FALLBACK_SITE_URL);
  }
}
