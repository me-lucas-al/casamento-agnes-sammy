import { EventSettingsForm } from "@/modules/event/components/event-settings-form";
import { getEventSettingsQuery } from "@/modules/event/controllers/event.queries";
import { PageHeading } from "@/shared/ui/components/page-heading";

export default async function EventSettingsPage() {
  const settings = await getEventSettingsQuery();
  return (
    <section className="flex flex-col gap-4">
      <PageHeading title="Evento e Pix" description="Data, local, história e a chave Pix que aparece para os convidados." align="start" />
      <EventSettingsForm settings={settings} />
    </section>
  );
}
