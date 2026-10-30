import { eq } from "drizzle-orm";
import { eventSettings } from "@/shared/db/schema";
import type { Database } from "@/shared/db/types";
import type { PixSettingsRepository } from "./pix-settings-repository";

const SETTINGS_ROW_ID = 1;

export function createDrizzlePixSettingsRepository(database: Database): PixSettingsRepository {
  return {
    async find() {
      const [row] = await database
        .select()
        .from(eventSettings)
        .where(eq(eventSettings.id, SETTINGS_ROW_ID))
        .limit(1);
      if (!row?.pixKey || !row.pixKeyType || !row.pixReceiverName || !row.pixCity) return null;
      return {
        pixKey: row.pixKey,
        pixKeyType: row.pixKeyType,
        pixReceiverName: row.pixReceiverName,
        pixCity: row.pixCity,
      };
    },
  };
}
