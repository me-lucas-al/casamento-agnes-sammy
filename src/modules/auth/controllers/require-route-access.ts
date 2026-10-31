import { redirect } from "next/navigation";
import { resolveRedirectDestination } from "../lib/route-access";
import type { SessionUser } from "../types";
import { getSessionUser } from "./get-session-user";

export async function requireRouteAccess(pathname: string): Promise<SessionUser> {
  const user = await getSessionUser();
  const destination = resolveRedirectDestination(pathname, user?.role);
  if (destination) redirect(destination);
  if (!user) redirect("/");
  return user;
}
