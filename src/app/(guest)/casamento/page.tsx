import { getEventSettingsQuery } from "@/modules/event/controllers/event.queries";
import { EventDetails } from "@/modules/profile/components/event-details";
import { StorySection } from "@/modules/profile/components/story-section";

export default async function WeddingPage() {
  const settings = await getEventSettingsQuery();

  return (
    <div className="mx-auto flex max-w-3xl flex-col gap-6">
      <h1 className="text-center font-heading text-4xl italic text-wine">O casamento</h1>
      <EventDetails settings={settings} />
      <StorySection story={settings.story} />
    </div>
  );
}
