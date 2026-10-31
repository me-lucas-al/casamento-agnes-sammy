import type { SearchParams } from "@/shared/lib/url/url-params";
import type { SuggestionQuery } from "@/modules/gift-suggestions/lib/filters/suggestion-query";
import { MobileFilterPanel } from "./mobile-filter-panel";
import { SuggestionFilterFields } from "./suggestion-filter-fields";

type SuggestionFiltersFormProps = {
  basePath: string;
  query: SuggestionQuery;
  values: SearchParams;
  activeCount: number;
};

export function SuggestionFiltersForm({ basePath, query, values, activeCount }: SuggestionFiltersFormProps) {
  return (
    <form action={basePath} method="get" aria-label="Filtros das sugestões">
      {query.q ? <input type="hidden" name="q" value={query.q} /> : null}
      <MobileFilterPanel activeCount={activeCount}>
        <div className="flex flex-col gap-3">
          <SuggestionFilterFields query={query} values={values} />
          <button type="submit" className="min-h-11 rounded-full bg-rose px-5 text-base font-semibold text-white hover:bg-crimson">
            Aplicar filtros
          </button>
        </div>
      </MobileFilterPanel>
    </form>
  );
}
