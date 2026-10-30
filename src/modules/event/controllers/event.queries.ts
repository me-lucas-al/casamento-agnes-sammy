import { eventTag } from "@/shared/lib/cache/cache-tags";
import { nextCachedReader } from "@/shared/lib/cache/cached-read";
import { getEventModule } from "../factory";
import { toEventSnapshot } from "../lib/event-snapshot";
import type { EventSettingsSnapshot } from "../types";

export async function getEventSettingsQuery(): Promise<EventSettingsSnapshot> {
  return nextCachedReader.read({ keyParts: ["event-settings"], tags: [eventTag()] }, async () => {
    const settings = await getEventModule().getEventSettings();
    return toEventSnapshot(settings);
  });
}
