import { maskAccessCode, maskEmail, maskPhone } from "@/shared/lib/privacy/mask-contact";
import { maskPersonName } from "@/shared/lib/privacy/mask-person-name";
import type { GuestListItem } from "../../types";

export function maskGuestForViewer(guest: GuestListItem): GuestListItem {
  return {
    ...guest,
    name: maskPersonName(guest.name),
    code: maskAccessCode(guest.code),
    phone: guest.phone ? maskPhone(guest.phone) : null,
    email: guest.email ? maskEmail(guest.email) : null,
  };
}
