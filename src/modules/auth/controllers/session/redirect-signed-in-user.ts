import { redirect } from "next/navigation";
import { resolveHomeRoute } from "@/modules/auth/lib/route-access";
import { getSessionUser } from "./get-session-user";

export async function redirectSignedInUser(): Promise<void> {
  const user = await getSessionUser();
  if (!user) return;
  redirect(resolveHomeRoute(user.role));
}
