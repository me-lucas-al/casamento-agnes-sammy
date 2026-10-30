import type { Role } from "@/modules/auth/types";
import type { Companion } from "@/modules/rsvp/types";

export type RsvpStatus = "pending" | "going" | "declined";

export type GuestProfile = {
  guestId: string;
  name: string;
  phone: string | null;
  email: string | null;
  seats: number;
  code: string;
  rsvpStatus: RsvpStatus;
  respondedAt: Date | null;
  relatives: Companion[];
  profileCompleted: boolean;
};

export type OwnProfileChanges = {
  name: string;
  phone: string;
  email: string;
  relatives: Companion[];
};

export type OwnProfileSave = OwnProfileChanges & { guestId: string; completedAt: Date };

export type StaffProfile = {
  userId: string;
  name: string;
  email: string;
  role: Role;
  image: string | null;
};
