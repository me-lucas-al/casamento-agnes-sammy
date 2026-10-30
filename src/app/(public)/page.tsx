import Link from "next/link";
import { EventInvitation } from "@/modules/event/components/event-invitation";
import { getEventSettingsQuery } from "@/modules/event/controllers/event.queries";

export default async function HomePage() {
  const settings = await getEventSettingsQuery();
  return (
    <>
      <EventInvitation settings={settings} />
      <nav aria-label="Acesso" className="mx-auto flex w-full max-w-md justify-center gap-6 bg-crimson pb-4 text-sm text-paper">
        <Link href="/entrar" className="underline underline-offset-4">
          Sou convidado
        </Link>
        <Link href="/admin/entrar" className="underline underline-offset-4">
          Área dos noivos
        </Link>
      </nav>
    </>
  );
}
