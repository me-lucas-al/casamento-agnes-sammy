import type { EventSettings, EventSettingsInput } from "../types";

export interface EventSettingsRepository {
  find(): Promise<EventSettings | null>;
  save(settings: EventSettingsInput): Promise<EventSettings>;
}
