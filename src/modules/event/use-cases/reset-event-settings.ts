import { requireRole } from "@/modules/auth/authorization";
import type { SessionUser } from "@/modules/auth/types";
import type { EventSettingsRepository } from "../repositories/event-settings-repository";

type Dependencies = { eventSettingsRepository: EventSettingsRepository };

export function makeResetEventSettings({ eventSettingsRepository }: Dependencies) {
  return async function resetEventSettings(actor: SessionUser | null): Promise<void> {
    requireRole(actor, ["admin", "couple"]);
    await eventSettingsRepository.remove();
  };
}
