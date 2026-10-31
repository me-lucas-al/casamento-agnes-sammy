import { EmptyState } from "@/shared/ui/feedback/empty-state";
import { PaginationControls } from "@/shared/ui/navigation/pagination-controls";
import type { PageResult } from "@/shared/lib/pagination/pagination";
import type { SearchParams } from "@/shared/lib/url/url-params";
import type { SuggestionWithStatus } from "@/modules/gift-suggestions/types";
import { SuggestionsBoard } from "./suggestions-board";

type SuggestionsResultsProps = {
  basePath: string;
  params: SearchParams;
  pageResult: PageResult<SuggestionWithStatus>;
};

export function SuggestionsResults({ basePath, params, pageResult }: SuggestionsResultsProps) {
  if (pageResult.total === 0) {
    return (
      <EmptyState
        title="Nenhuma sugestão encontrada"
        description="Tente buscar por outra palavra ou remover alguns filtros para ver mais ideias."
      />
    );
  }
  return (
    <>
      <SuggestionsBoard key={`${pageResult.page}-${pageResult.total}`} suggestions={pageResult.items} />
      <PaginationControls basePath={basePath} searchParams={params} pageResult={pageResult} />
    </>
  );
}
