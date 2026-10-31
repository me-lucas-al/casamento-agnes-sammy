import type { SessionAccountLookup } from "../repositories/contracts/session-account-lookup";
import type { SessionUser } from "../types";

type Dependencies = { sessionAccountLookup: SessionAccountLookup };

export function makeValidateSessionUser({ sessionAccountLookup }: Dependencies) {
  return async function validateSessionUser(sessionUser: SessionUser): Promise<SessionUser | null> {
    if (sessionUser.role === "guest") {
      if (!sessionUser.guestId) return null;
      const exists = await sessionAccountLookup.guestExists(sessionUser.guestId);
      return exists ? sessionUser : null;
    }
    const currentRole = await sessionAccountLookup.findActiveStaffRole(sessionUser.id);
    return currentRole === sessionUser.role ? sessionUser : null;
  };
}
