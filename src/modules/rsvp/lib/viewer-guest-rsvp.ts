import { VIEWER_USER_ID } from "@/modules/auth/types";
import type { GuestRsvp } from "../types";

export const VIEWER_GUEST_RSVP: GuestRsvp = {
  guestId: VIEWER_USER_ID,
  guestName: "Convidado(a) de exemplo",
  seats: 2,
  status: "pending",
  dietaryNote: null,
  respondedAt: null,
  companions: [],
};
