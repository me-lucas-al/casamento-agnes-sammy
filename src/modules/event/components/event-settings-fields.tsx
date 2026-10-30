import { FormField, textInputClassName } from "@/shared/ui/components/form-field";
import { formatSaoPauloLocalDateTime } from "../lib/sao-paulo-local-datetime";
import type { EventSettingsSnapshot } from "../types";

type EventSettingsFieldsProps = { settings: EventSettingsSnapshot };

function toLocalInput(iso: string | null): string {
  return iso ? formatSaoPauloLocalDateTime(new Date(iso)) : "";
}

export function EventSettingsFields({ settings }: EventSettingsFieldsProps) {
  return (
    <>
      <FormField label="Nomes do casal" htmlFor="coupleNames">
        <input id="coupleNames" name="coupleNames" required defaultValue={settings.coupleNames} className={textInputClassName} />
      </FormField>
      <FormField label="Data e hora (horário de Brasília)" htmlFor="eventAt">
        <input id="eventAt" name="eventAt" type="datetime-local" required defaultValue={toLocalInput(settings.eventAt)} className={textInputClassName} />
      </FormField>
      <FormField label="Local" htmlFor="venueName">
        <input id="venueName" name="venueName" required defaultValue={settings.venueName} className={textInputClassName} />
      </FormField>
      <FormField label="Endereço" htmlFor="address">
        <input id="address" name="address" required defaultValue={settings.address} className={textInputClassName} />
      </FormField>
      <FormField label="Link do mapa" htmlFor="mapUrl" hint="Começa com https://">
        <input id="mapUrl" name="mapUrl" type="url" defaultValue={settings.mapUrl ?? ""} className={textInputClassName} />
      </FormField>
      <FormField label="Prazo para confirmar presença" htmlFor="rsvpDeadline">
        <input id="rsvpDeadline" name="rsvpDeadline" type="datetime-local" defaultValue={toLocalInput(settings.rsvpDeadline)} className={textInputClassName} />
      </FormField>
      <FormField label="Nossa história" htmlFor="story">
        <textarea id="story" name="story" rows={5} defaultValue={settings.story ?? ""} className={textInputClassName} />
      </FormField>
    </>
  );
}
