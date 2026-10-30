import { eventTag } from "@/shared/lib/cache/cache-tags";
import { nextCachedReader } from "@/shared/lib/cache/cached-read";
import { getEventModule } from "../factory";
import { DEFAULT_EVENT_SETTINGS } from "../lib/default-event-settings";
import { toEventSnapshot } from "../lib/event-snapshot";
import type { EventSettingsSnapshot } from "../types";

export async function getEventSettingsQuery(): Promise<EventSettingsSnapshot> {
  try {
    return await nextCachedReader.read({ keyParts: ["event-settings"], tags: [eventTag()] }, async () => {
      const settings = await getEventModule().getEventSettings();
      return toEventSnapshot(settings);
    });
  } catch {
    return toEventSnapshot(DEFAULT_EVENT_SETTINGS);
  }
}
