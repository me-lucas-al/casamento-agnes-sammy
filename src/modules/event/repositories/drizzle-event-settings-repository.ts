import { eq } from "drizzle-orm";
import { eventSettings } from "@/shared/db/schema";
import type { Database } from "@/shared/db/types";
import type { EventSettingsRepository } from "./event-settings-repository";

const SETTINGS_ROW_ID = 1;

export function createDrizzleEventSettingsRepository(database: Database): EventSettingsRepository {
  return {
    async find() {
      const [settings] = await database
        .select()
        .from(eventSettings)
        .where(eq(eventSettings.id, SETTINGS_ROW_ID))
        .limit(1);
      return settings ?? null;
    },
    async save(settings) {
      const [saved] = await database
        .insert(eventSettings)
        .values({ id: SETTINGS_ROW_ID, ...settings })
        .onConflictDoUpdate({ target: eventSettings.id, set: settings })
        .returning();
      return saved;
    },
    async remove() {
      await database.delete(eventSettings).where(eq(eventSettings.id, SETTINGS_ROW_ID));
    },
  };
}
