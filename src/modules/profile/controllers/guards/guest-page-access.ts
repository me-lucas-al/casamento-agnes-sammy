import { redirect } from "next/navigation";
import { getSessionUser } from "@/modules/auth/controllers/session/get-session-user";

export async function requireGuestPageAccess(): Promise<void> {
  const actor = await getSessionUser();
  if (!actor) redirect("/");
  if (actor.role !== "guest") redirect("/painel");
}
