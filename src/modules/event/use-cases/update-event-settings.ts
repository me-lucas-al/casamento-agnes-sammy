import { requireRole } from "@/modules/auth/authorization";
import type { SessionUser } from "@/modules/auth/types";
import { InvalidPixKeyError } from "../errors";
import { toEventSettingsInput } from "../lib/event-snapshot";
import { isValidPixKey, normalizePixKey } from "../lib/pix-key-validation";
import type { EventSettingsRepository } from "../repositories/contracts/event-settings-repository";
import type { EventSettingsInput } from "../types";

type Dependencies = { eventSettingsRepository: EventSettingsRepository };

function normalizePix(settings: EventSettingsInput): EventSettingsInput {
  const { pixKey, pixKeyType } = settings;
  if (!pixKey && !pixKeyType) return { ...settings, pixKey: null, pixKeyType: null };
  if (!pixKey || !pixKeyType) throw new InvalidPixKeyError();
  if (!isValidPixKey(pixKeyType, pixKey)) throw new InvalidPixKeyError();
  return { ...settings, pixKey: normalizePixKey(pixKeyType, pixKey) };
}

export function makeUpdateEventSettings({ eventSettingsRepository }: Dependencies) {
  return async function updateEventSettings(
    actor: SessionUser | null,
    settings: EventSettingsInput,
  ): Promise<EventSettingsInput> {
    requireRole(actor, ["admin", "couple"]);
    const saved = await eventSettingsRepository.save(normalizePix(settings));
    return toEventSettingsInput(saved);
  };
}
