import type { GuestRsvp } from "../types";

export function RsvpSummary({ guestRsvp }: { guestRsvp: GuestRsvp }) {
  const answerText = guestRsvp.status === "going" ? "Você confirmou presença." : "Você informou que não poderá ir.";

  return (
    <section className="flex flex-col gap-3 rounded-xl bg-blush p-4 text-wine">
      <p>{answerText}</p>
      {guestRsvp.companions.length > 0 ? (
        <ul className="list-disc pl-5 text-sm">
          {guestRsvp.companions.map((companion) => (
            <li key={companion.name}>{companion.name}</li>
          ))}
        </ul>
      ) : null}
      <p className="text-sm text-wine/70">Para alterar sua resposta, fale com os noivos.</p>
    </section>
  );
}
