export type RsvpAnswer = "going" | "declined";

export type RsvpStatus = "pending" | RsvpAnswer;

export const RSVP_STATUSES = ["pending", "going", "declined"] as const;

export type Companion = {
  name: string;
  dietaryNote: string | null;
};

export type GuestRsvp = {
  guestId: string;
  guestName: string;
  seats: number;
  status: RsvpStatus;
  dietaryNote: string | null;
  respondedAt: Date | null;
  companions: Companion[];
};

export type RsvpSubmission = {
  guestId: string;
  status: RsvpAnswer;
  dietaryNote: string | null;
  companions: Companion[];
  respondedAt: Date;
};

export type RsvpTotals = {
  going: number;
  declined: number;
  pending: number;
  attendingPeople: number;
};

export type RsvpListItem = {
  guestId: string;
  guestName: string;
  seats: number;
  status: RsvpStatus;
  companionsCount: number;
  respondedAt: Date | null;
};

export type RsvpListQuery = {
  limit: number;
  offset: number;
  status: RsvpStatus | undefined;
  search: string;
};

export type RsvpListPage = {
  items: RsvpListItem[];
  total: number;
};
