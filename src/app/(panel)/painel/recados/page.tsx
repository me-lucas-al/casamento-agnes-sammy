import { ModerationList } from "@/modules/messages/components/moderation-list";
import { listMessagesForModerationQuery } from "@/modules/messages/controllers/messages.queries";
import { MODERATION_STATUSES } from "@/modules/messages/types";
import { enumParam, type SearchParams } from "@/shared/lib/url-params";
import { EmptyState } from "@/shared/ui/empty-state";
import { PaginationControls } from "@/shared/ui/pagination-controls";
import { StatusFilterLinks } from "@/shared/ui/status-filter-links";

const BASE_PATH = "/painel/recados";

const filterOptions = [
  { value: "pending", label: "Pendentes" },
  { value: "approved", label: "Aprovados" },
  { value: "rejected", label: "Rejeitados" },
];

export default async function MessagesModerationPage({ searchParams }: { searchParams: Promise<SearchParams> }) {
  const resolvedSearchParams = await searchParams;
  const pageResult = await listMessagesForModerationQuery(resolvedSearchParams);

  return (
    <div className="flex flex-col gap-4">
      <h1 className="text-2xl text-wine">Recados</h1>
      <StatusFilterLinks
        basePath={BASE_PATH}
        searchParams={resolvedSearchParams}
        activeValue={enumParam(resolvedSearchParams, "status", MODERATION_STATUSES)}
        options={filterOptions}
      />
      {pageResult.items.length === 0 ? (
        <EmptyState title="Nenhum recado encontrado" />
      ) : (
        <ModerationList messages={pageResult.items} />
      )}
      <PaginationControls basePath={BASE_PATH} searchParams={resolvedSearchParams} pageResult={pageResult} />
    </div>
  );
}
