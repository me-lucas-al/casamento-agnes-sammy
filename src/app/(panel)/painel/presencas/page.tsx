import { RsvpPanelSection } from "@/modules/rsvp/components/rsvp-panel-section";
import type { SearchParams } from "@/shared/lib/url/url-params";

export default async function RsvpPanelPage({ searchParams }: { searchParams: Promise<SearchParams> }) {
  return <RsvpPanelSection searchParams={await searchParams} basePath="/painel/presencas" />;
}
