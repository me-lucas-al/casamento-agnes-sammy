import type { Role } from "@/modules/auth/types";

export type RsvpStatus = "pending" | "going" | "declined";

export type GuestProfile = {
  guestId: string;
  name: string;
  phone: string | null;
  seats: number;
  code: string;
  rsvpStatus: RsvpStatus;
  respondedAt: Date | null;
};

export type StaffProfile = {
  userId: string;
  name: string;
  email: string;
  role: Role;
  image: string | null;
};
