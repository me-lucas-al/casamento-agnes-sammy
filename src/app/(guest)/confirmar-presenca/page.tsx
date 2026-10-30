import { redirect } from "next/navigation";
import { getSessionUser } from "@/modules/auth/controllers/get-session-user";
import { getMyRsvpQuery } from "@/modules/rsvp/controllers/rsvp.queries";
import { RsvpForm } from "@/modules/rsvp/components/rsvp-form";
import { PageHeading } from "@/shared/ui/components/page-heading";

export const dynamic = "force-dynamic";

export default async function ConfirmPresencePage() {
  const actor = await getSessionUser();
  if (actor && actor.role !== "guest") redirect("/painel/presencas");
  const guestRsvp = await getMyRsvpQuery();

  return (
    <div className="mx-auto flex max-w-md flex-col gap-6">
      <PageHeading
        title="Confirmar presença"
        description={`${guestRsvp.guestName}, seu convite tem ${guestRsvp.seats} ${guestRsvp.seats === 1 ? "vaga" : "vagas"}. Conta pra gente se você vem!`}
      />
      <RsvpForm initial={guestRsvp} />
    </div>
  );
}
