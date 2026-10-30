import { getDatabase } from "@/shared/db/client";
import type { Database } from "@/shared/db/types";
import { createDrizzleEventSettingsRepository } from "./repositories/drizzle-event-settings-repository";
import { makeGetEventSettings } from "./use-cases/get-event-settings";
import { makeResetEventSettings } from "./use-cases/reset-event-settings";
import { makeUpdateEventSettings } from "./use-cases/update-event-settings";

export function createEventModule(database: Database) {
  const eventSettingsRepository = createDrizzleEventSettingsRepository(database);
  return {
    eventSettingsRepository,
    getEventSettings: makeGetEventSettings({ eventSettingsRepository }),
    updateEventSettings: makeUpdateEventSettings({ eventSettingsRepository }),
    resetEventSettings: makeResetEventSettings({ eventSettingsRepository }),
  };
}

export type EventModule = ReturnType<typeof createEventModule>;

export function getEventModule(): EventModule {
  return createEventModule(getDatabase());
}
