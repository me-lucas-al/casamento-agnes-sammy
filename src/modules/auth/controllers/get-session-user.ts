import { auth } from "../config/auth";
import { getAuthModule } from "../factory";
import { isRole, type SessionUser } from "../types";

export async function getSessionUser(): Promise<SessionUser | null> {
  const session = await auth();
  const user = session?.user;
  if (!user?.id || !isRole(user.role)) return null;
  return getAuthModule().validateSessionUser({ id: user.id, role: user.role, guestId: user.guestId });
}
