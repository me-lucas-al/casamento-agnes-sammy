import { DEFAULT_EVENT_SETTINGS } from "../lib/default-event-settings";
import { toEventSettingsInput } from "../lib/event-snapshot";
import type { EventSettingsRepository } from "../repositories/event-settings-repository";
import type { EventSettingsInput } from "../types";

type Dependencies = { eventSettingsRepository: EventSettingsRepository };

export function makeGetEventSettings({ eventSettingsRepository }: Dependencies) {
  return async function getEventSettings(): Promise<EventSettingsInput> {
    const settings = await eventSettingsRepository.find();
    if (!settings) return DEFAULT_EVENT_SETTINGS;
    return toEventSettingsInput(settings);
  };
}
