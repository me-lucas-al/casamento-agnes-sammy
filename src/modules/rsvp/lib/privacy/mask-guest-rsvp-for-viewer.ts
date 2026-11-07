import { maskPersonName } from "@/shared/lib/privacy/mask-person-name";
import type { GuestRsvp } from "../../types";

export function maskGuestRsvpForViewer(guestRsvp: GuestRsvp): GuestRsvp {
  return {
    ...guestRsvp,
    guestName: maskPersonName(guestRsvp.guestName),
    dietaryNote: null,
    companions: guestRsvp.companions.map(() => ({ name: "Acompanhante", dietaryNote: null })),
  };
}
