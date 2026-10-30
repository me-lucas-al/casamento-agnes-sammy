import type { eventSettings } from "./schema";

export type EventSettings = typeof eventSettings.$inferSelect;

export type PixKeyType = NonNullable<EventSettings["pixKeyType"]>;

export type EventSettingsInput = Omit<EventSettings, "id">;

export type EventSettingsSnapshot = {
  coupleNames: string;
  eventAt: string;
  venueName: string;
  address: string;
  mapUrl: string | null;
  story: string | null;
  rsvpDeadline: string | null;
  pixKey: string | null;
  pixKeyType: PixKeyType | null;
  pixReceiverName: string | null;
  pixCity: string | null;
};
