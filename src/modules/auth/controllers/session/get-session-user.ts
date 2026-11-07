import { auth } from "@/modules/auth/config/auth";
import { getAuthModule } from "@/modules/auth/factory";
import { isRole, type SessionUser } from "@/modules/auth/types";
import { isViewerModeEnabled } from "./viewer-mode";

export async function getSessionUser(): Promise<SessionUser | null> {
  const session = await auth();
  const user = session?.user;
  if (!user?.id || !isRole(user.role)) return null;
  if (user.role === "viewer" && !isViewerModeEnabled()) return null;
  return getAuthModule().validateSessionUser({ id: user.id, role: user.role, guestId: user.guestId });
}
