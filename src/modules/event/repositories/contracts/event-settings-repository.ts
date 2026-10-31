import type { EventSettings, EventSettingsInput } from "@/modules/event/types";

export interface EventSettingsRepository {
  find(): Promise<EventSettings | null>;
  save(settings: EventSettingsInput): Promise<EventSettings>;
  remove(): Promise<void>;
}
