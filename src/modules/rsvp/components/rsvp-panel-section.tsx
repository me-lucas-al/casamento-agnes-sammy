import { EmptyState } from "@/shared/ui/feedback/empty-state";
import { PaginationControls } from "@/shared/ui/navigation/pagination-controls";
import { StatusFilterLinks } from "@/shared/ui/navigation/status-filter-links";
import { enumParam, type SearchParams } from "@/shared/lib/url/url-params";
import { listRsvpsPageQuery } from "../controllers/queries/rsvp.queries";
import { RSVP_STATUSES } from "../types";
import { RsvpList } from "./rsvp-list";
import { RsvpTotalsSection } from "./rsvp-totals-section";

const DEFAULT_BASE_PATH = "/painel";

const filterOptions = [
  { value: "going", label: "Confirmados" },
  { value: "declined", label: "Recusaram" },
  { value: "pending", label: "Pendentes" },
];

export async function RsvpPanelSection({
  searchParams,
  basePath = DEFAULT_BASE_PATH,
}: {
  searchParams: SearchParams;
  basePath?: string;
}) {
  const pageResult = await listRsvpsPageQuery(searchParams);

  return (
    <div className="flex flex-col gap-4">
      <RsvpTotalsSection />
      <StatusFilterLinks
        basePath={basePath}
        searchParams={searchParams}
        activeValue={enumParam(searchParams, "status", RSVP_STATUSES)}
        options={filterOptions}
      />
      {pageResult.items.length === 0 ? (
        <EmptyState title="Nenhuma resposta encontrada" />
      ) : (
        <RsvpList items={pageResult.items} />
      )}
      <PaginationControls basePath={basePath} searchParams={searchParams} pageResult={pageResult} />
    </div>
  );
}
