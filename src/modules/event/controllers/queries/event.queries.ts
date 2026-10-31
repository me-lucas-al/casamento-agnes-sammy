import { eventTag } from "@/shared/lib/cache/cache-tags";
import { nextCachedReader } from "@/shared/lib/cache/cached-read";
import { logger } from "@/shared/lib/logging/logger";
import { serializeError } from "@/shared/lib/logging/serialize-error";
import { withTimeout } from "@/shared/lib/resilience/with-timeout";
import { getEventModule } from "@/modules/event/factory";
import { DEFAULT_EVENT_SETTINGS } from "@/modules/event/lib/default-event-settings";
import { toEventSnapshot } from "@/modules/event/lib/event-snapshot";
import type { EventSettingsSnapshot } from "@/modules/event/types";

const EVENT_SETTINGS_TIMEOUT_MILLISECONDS = 4000;

function readCachedEventSettings(): Promise<EventSettingsSnapshot> {
  return nextCachedReader.read({ keyParts: ["event-settings"], tags: [eventTag()] }, async () => {
    const settings = await getEventModule().getEventSettings();
    return toEventSnapshot(settings);
  });
}

export async function getEventSettingsQuery(): Promise<EventSettingsSnapshot> {
  try {
    return await withTimeout(readCachedEventSettings(), EVENT_SETTINGS_TIMEOUT_MILLISECONDS);
  } catch (error) {
    logger.error("query.event_settings_fallback", { error: serializeError(error) });
    return toEventSnapshot(DEFAULT_EVENT_SETTINGS);
  }
}
