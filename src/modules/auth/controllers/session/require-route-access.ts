import { redirect } from "next/navigation";
import { resolveRedirectDestination } from "@/modules/auth/lib/route-access";
import type { SessionUser } from "@/modules/auth/types";
import { getSessionUser } from "./get-session-user";

export async function requireRouteAccess(pathname: string): Promise<SessionUser> {
  const user = await getSessionUser();
  const destination = resolveRedirectDestination(pathname, user?.role);
  if (destination) redirect(destination);
  if (!user) redirect("/");
  return user;
}
