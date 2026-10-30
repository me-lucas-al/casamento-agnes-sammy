import { redirect } from "next/navigation";
import { getSessionUser } from "@/modules/auth/controllers/get-session-user";
import { getMyRsvpQuery } from "@/modules/rsvp/controllers/rsvp.queries";
import { RsvpForm } from "@/modules/rsvp/components/rsvp-form";

export const dynamic = "force-dynamic";

export default async function ConfirmPresencePage() {
  const actor = await getSessionUser();
  if (actor && actor.role !== "guest") redirect("/painel/presencas");
  const guestRsvp = await getMyRsvpQuery();

  return (
    <div className="mx-auto flex max-w-md flex-col gap-6">
      <header className="flex flex-col gap-2 text-center">
        <h1 className="text-3xl italic text-wine">Confirmar presença</h1>
        <p className="text-wine/80">
          {guestRsvp.guestName}, seu convite tem {guestRsvp.seats}{" "}
          {guestRsvp.seats === 1 ? "vaga" : "vagas"}.
        </p>
      </header>
      <RsvpForm initial={guestRsvp} />
    </div>
  );
}
