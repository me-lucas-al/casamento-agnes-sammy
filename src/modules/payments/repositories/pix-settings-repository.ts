import type { PixSettings } from "../types";

export interface PixSettingsRepository {
  find(): Promise<PixSettings | null>;
}
