import { getRsvpTotalsQuery } from "../controllers/rsvp.queries";

export async function RsvpTotalsSection() {
  const totals = await getRsvpTotalsQuery();
  const cards = [
    { label: "Confirmados", value: totals.going },
    { label: "Recusaram", value: totals.declined },
    { label: "Pendentes", value: totals.pending },
    { label: "Pessoas presentes", value: totals.attendingPeople },
  ];

  return (
    <section aria-labelledby="rsvp-totals-title" className="flex flex-col gap-3">
      <h2 id="rsvp-totals-title" className="text-xl text-wine">
        Confirmações de presença
      </h2>
      <dl className="grid grid-cols-2 gap-3 md:grid-cols-4">
        {cards.map(({ label, value }) => (
          <div key={label} className="rounded-xl bg-blush p-4">
            <dt className="text-xs uppercase tracking-wide text-wine/70">{label}</dt>
            <dd className="text-3xl text-wine">{value}</dd>
          </div>
        ))}
      </dl>
    </section>
  );
}
