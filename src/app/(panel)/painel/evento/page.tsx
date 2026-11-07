import { EventSettingsForm } from "@/modules/event/components/event-settings-form";
import { getPanelEventSettingsQuery } from "@/modules/event/controllers/queries/panel-event.queries";
import { PageHeading } from "@/shared/ui/layout/page-heading";

export default async function EventSettingsPage() {
  const settings = await getPanelEventSettingsQuery();
  return (
    <section className="flex flex-col gap-4">
      <PageHeading title="Evento e Pix" description="Data, local, história e a chave Pix que aparece para os convidados." align="start" />
      <EventSettingsForm settings={settings} />
    </section>
  );
}
