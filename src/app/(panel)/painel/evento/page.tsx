import { EventSettingsForm } from "@/modules/event/components/event-settings-form";
import { getEventSettingsQuery } from "@/modules/event/controllers/event.queries";

export default async function EventSettingsPage() {
  const settings = await getEventSettingsQuery();
  return (
    <section className="flex flex-col gap-4">
      <h1 className="font-heading text-3xl italic">Evento e Pix</h1>
      <EventSettingsForm settings={settings} />
    </section>
  );
}
