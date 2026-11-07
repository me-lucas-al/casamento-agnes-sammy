import { maskPersonName } from "@/shared/lib/privacy/mask-person-name";
import type { RsvpListItem } from "../../types";

export function maskRsvpItemForViewer(item: RsvpListItem): RsvpListItem {
  return { ...item, guestName: maskPersonName(item.guestName) };
}
