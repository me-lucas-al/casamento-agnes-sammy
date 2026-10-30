import type { EventSettingsInput } from "../types";

export const DEFAULT_EVENT_SETTINGS: EventSettingsInput = {
  coupleNames: "Agnes & Sammy",
  eventAt: new Date("2026-11-07T22:00:00.000Z"),
  venueName: "Restaurante Fazenda",
  address: "Av. Mal. Castelo Branco, 760 Jardim da Luz, Itatiba / SP 13255-350",
  mapUrl: null,
  story: null,
  rsvpDeadline: new Date("2026-10-25T23:59:00.000Z"),
  pixKey: null,
  pixKeyType: null,
  pixReceiverName: null,
  pixCity: null,
};
