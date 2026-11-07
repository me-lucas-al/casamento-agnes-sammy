import { maskPixKey } from "@/shared/lib/privacy/mask-contact";
import { maskPersonName } from "@/shared/lib/privacy/mask-person-name";
import type { EventSettingsSnapshot } from "../../types";

export function maskEventSettingsForViewer(settings: EventSettingsSnapshot): EventSettingsSnapshot {
  return {
    ...settings,
    pixKey: settings.pixKey ? maskPixKey(settings.pixKey) : null,
    pixReceiverName: settings.pixReceiverName ? maskPersonName(settings.pixReceiverName) : null,
  };
}
