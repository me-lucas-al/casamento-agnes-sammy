import { requireRole } from "@/modules/auth/authorization";
import { ForbiddenError } from "@/modules/auth/errors";
import type { SessionUser } from "@/modules/auth/types";

export function requireGuestId(actor: SessionUser | null): string {
  const guest = requireRole(actor, ["guest"]);
  if (!guest.guestId) throw new ForbiddenError();
  return guest.guestId;
}
