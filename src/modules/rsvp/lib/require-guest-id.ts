import { ForbiddenError, UnauthenticatedError } from "@/modules/auth/errors";
import type { SessionUser } from "@/modules/auth/types";

export function requireGuestId(actor: SessionUser | null): string {
  if (!actor) throw new UnauthenticatedError();
  if (actor.role !== "guest" || !actor.guestId) throw new ForbiddenError();
  return actor.guestId;
}
