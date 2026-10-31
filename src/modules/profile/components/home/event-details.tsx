import { getEventDateParts } from "@/modules/event/lib/event-date-parts";
import type { EventSettingsSnapshot } from "@/modules/event/types";
import { formatDateTimeInSaoPaulo } from "@/shared/lib/dates";

type EventDetailsProps = { settings: EventSettingsSnapshot };

type DetailRowProps = { label: string; children: string };

function DetailRow({ label, children }: DetailRowProps) {
  return (
    <div className="flex flex-col gap-1 rounded-2xl border border-gold/40 bg-paper px-4 py-3">
      <dt className="text-base text-rose">{label}</dt>
      <dd className="text-xl">{children}</dd>
    </div>
  );
}

export function EventDetails({ settings }: EventDetailsProps) {
  const eventAt = new Date(settings.eventAt);
  const { weekday } = getEventDateParts(eventAt);
  return (
    <div className="flex flex-col gap-6">
      <dl className="grid gap-3 md:grid-cols-2">
        <DetailRow label="Data e horário">{`${weekday}, ${formatDateTimeInSaoPaulo(eventAt)}`}</DetailRow>
        <DetailRow label="Local">{settings.venueName || "Local a definir"}</DetailRow>
        <DetailRow label="Endereço">{settings.address || "Endereço a definir"}</DetailRow>
        {settings.rsvpDeadline ? (
          <DetailRow label="Confirme até">{formatDateTimeInSaoPaulo(new Date(settings.rsvpDeadline))}</DetailRow>
        ) : null}
      </dl>
      {settings.mapUrl ? (
        <a
          href={settings.mapUrl}
          target="_blank"
          rel="noopener noreferrer"
          className="self-start rounded-full bg-rose px-6 py-3 text-lg text-white transition-colors hover:bg-crimson"
        >
          Como chegar
        </a>
      ) : (
        <p className="text-base">O link do mapa será divulgado em breve.</p>
      )}
    </div>
  );
}
