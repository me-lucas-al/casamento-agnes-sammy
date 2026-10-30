import type { EventSettings, EventSettingsInput, EventSettingsSnapshot } from "../types";

export function toEventSettingsInput(settings: EventSettings): EventSettingsInput {
  return {
    coupleNames: settings.coupleNames,
    eventAt: settings.eventAt,
    venueName: settings.venueName,
    address: settings.address,
    mapUrl: settings.mapUrl,
    story: settings.story,
    rsvpDeadline: settings.rsvpDeadline,
    pixKey: settings.pixKey,
    pixKeyType: settings.pixKeyType,
    pixReceiverName: settings.pixReceiverName,
    pixCity: settings.pixCity,
  };
}

export function toEventSnapshot(settings: EventSettingsInput): EventSettingsSnapshot {
  return {
    ...settings,
    eventAt: settings.eventAt.toISOString(),
    rsvpDeadline: settings.rsvpDeadline?.toISOString() ?? null,
  };
}
