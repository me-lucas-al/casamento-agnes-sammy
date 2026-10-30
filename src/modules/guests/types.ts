import type { guests } from "./schema";

export type Guest = typeof guests.$inferSelect;

export type RsvpStatus = "pending" | "going" | "declined";

export type GuestListItem = Guest & { rsvpStatus: RsvpStatus };

export const GUEST_SORTS = ["recent", "name", "access"] as const;

export type GuestSort = (typeof GUEST_SORTS)[number];

export type GuestDetails = {
  name: string;
  phone?: string | null;
  seats: number;
};

export type NewGuest = GuestDetails & { code: string; createdBy: string };

export type GuestListQuery = {
  limit: number;
  offset: number;
  search: string;
  sort: GuestSort;
};

export type GuestListPage = {
  items: GuestListItem[];
  total: number;
};
