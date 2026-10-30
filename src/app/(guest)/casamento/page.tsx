import { getEventSettingsQuery } from "@/modules/event/controllers/event.queries";
import { EventDetails } from "@/modules/profile/components/event-details";
import { StorySection } from "@/modules/profile/components/story-section";
import { PageHeading } from "@/shared/ui/components/page-heading";

export default async function WeddingPage() {
  const settings = await getEventSettingsQuery();

  return (
    <div className="mx-auto flex max-w-3xl flex-col gap-6">
      <PageHeading title="O casamento" description="Tudo o que você precisa saber sobre a nossa noite." />
      <EventDetails settings={settings} />
      <StorySection story={settings.story} />
    </div>
  );
}
