import { VIEWER_USER_ID } from "@/modules/auth/types";
import type { GuestProfile } from "../types";

export const VIEWER_GUEST_PROFILE: GuestProfile = {
  guestId: VIEWER_USER_ID,
  name: "Convidado(a) de exemplo",
  phone: null,
  email: null,
  seats: 2,
  code: "••••••••",
  rsvpStatus: "pending",
  respondedAt: null,
  relatives: [],
  profileCompleted: true,
};
