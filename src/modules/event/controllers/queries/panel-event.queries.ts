import { getSessionUser } from "@/modules/auth/controllers/session/get-session-user";
import { isViewer } from "@/modules/auth/lib/is-viewer";
import { maskEventSettingsForViewer } from "@/modules/event/lib/privacy/mask-event-settings-for-viewer";
import type { EventSettingsSnapshot } from "@/modules/event/types";
import { getEventSettingsQuery } from "./event.queries";

export async function getPanelEventSettingsQuery(): Promise<EventSettingsSnapshot> {
  const [settings, actor] = await Promise.all([getEventSettingsQuery(), getSessionUser()]);
  return isViewer(actor) ? maskEventSettingsForViewer(settings) : settings;
}
