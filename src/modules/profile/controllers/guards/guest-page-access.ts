import { redirect } from "next/navigation";
import { getSessionUser } from "@/modules/auth/controllers/session/get-session-user";
import { isViewer } from "@/modules/auth/lib/is-viewer";

export async function requireGuestPageAccess(): Promise<void> {
  const actor = await getSessionUser();
  if (!actor) redirect("/");
  if (actor.role !== "guest" && !isViewer(actor)) redirect("/painel");
}
