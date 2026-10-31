import type { ActiveUserLookup } from "../repositories/contracts/active-user-lookup";
import type { SessionUser } from "../types";

type Dependencies = { activeUserLookup: ActiveUserLookup };

export function makeAuthorizeGoogleSignIn({ activeUserLookup }: Dependencies) {
  return async function authorizeGoogleSignIn(email: string | null | undefined): Promise<SessionUser | null> {
    if (!email) return null;
    const allowedUser = await activeUserLookup.findActiveByEmail(email.trim().toLowerCase());
    if (!allowedUser) return null;
    return { id: allowedUser.id, role: allowedUser.role };
  };
}
