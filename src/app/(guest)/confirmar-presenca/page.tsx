import { getMyRsvpQuery } from "@/modules/rsvp/controllers/rsvp.queries";
import { RsvpForm } from "@/modules/rsvp/components/rsvp-form";
import { RsvpSummary } from "@/modules/rsvp/components/rsvp-summary";

export const dynamic = "force-dynamic";

export default async function ConfirmPresencePage() {
  const guestRsvp = await getMyRsvpQuery();

  return (
    <main className="mx-auto flex max-w-md flex-col gap-6 px-4 py-10">
      <header className="flex flex-col gap-2 text-center">
        <h1 className="text-3xl italic text-wine">Confirmar presença</h1>
        <p className="text-wine/80">
          {guestRsvp.guestName}, seu convite tem {guestRsvp.seats}{" "}
          {guestRsvp.seats === 1 ? "vaga" : "vagas"}.
        </p>
      </header>
      {guestRsvp.respondedAt ? <RsvpSummary guestRsvp={guestRsvp} /> : <RsvpForm initial={guestRsvp} />}
    </main>
  );
}
