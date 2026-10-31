import type { PixSettings } from "@/modules/payments/types";

export interface PixSettingsRepository {
  find(): Promise<PixSettings | null>;
}
