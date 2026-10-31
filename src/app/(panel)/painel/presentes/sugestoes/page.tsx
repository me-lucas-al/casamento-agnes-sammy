import Link from "next/link";
import { ActiveFilterChips } from "@/modules/gift-suggestions/components/filters/active-filter-chips";
import { CategoryQuickLinks } from "@/modules/gift-suggestions/components/filters/category-quick-links";
import { SuggestionFiltersForm } from "@/modules/gift-suggestions/components/filters/suggestion-filters-form";
import { SuggestionSearchBar } from "@/modules/gift-suggestions/components/filters/suggestion-search-bar";
import { SuggestionsResults } from "@/modules/gift-suggestions/components/board/suggestions-results";
import { listSuggestionsWithStatusQuery } from "@/modules/gift-suggestions/controllers/queries/suggestions.queries";
import { buildActiveFilterChips } from "@/modules/gift-suggestions/lib/filters/active-filter-chips";
import { serializeSuggestionQuery } from "@/modules/gift-suggestions/lib/filters/serialize-suggestion-query";
import { parseSuggestionQuery } from "@/modules/gift-suggestions/schemas/suggestion-query-params";
import type { SearchParams } from "@/shared/lib/url/url-params";
import { buttonVariants } from "@/shared/ui/primitives/button";
import { PageHeading } from "@/shared/ui/layout/page-heading";

export const dynamic = "force-dynamic";

const SUGGESTIONS_PATH = "/painel/presentes/sugestoes";

type SuggestionsPageProps = { searchParams: Promise<SearchParams> };

export default async function SuggestionsPage({ searchParams }: SuggestionsPageProps) {
  const rawParams = await searchParams;
  const query = parseSuggestionQuery(rawParams);
  const params = serializeSuggestionQuery(query);
  const pageResult = await listSuggestionsWithStatusQuery(rawParams);
  const chips = buildActiveFilterChips(query);

  return (
    <div className="flex w-full flex-col gap-5">
      <div className="flex flex-wrap items-center justify-between gap-3">
        <PageHeading
          title="Sugestões de presentes"
          description="Ideias para montar a lista de vocês em poucos toques. Nada é criado sem a escolha de vocês."
          align="start"
        />
        <Link href="/painel/presentes" className={buttonVariants({ variant: "outline" })}>
          Voltar para Presentes
        </Link>
      </div>
      <SuggestionSearchBar basePath={SUGGESTIONS_PATH} params={params} />
      <CategoryQuickLinks basePath={SUGGESTIONS_PATH} params={params} activeCategory={query.category} />
      <div className="grid gap-6 lg:grid-cols-[18rem_minmax(0,1fr)]">
        <aside aria-label="Filtros" className="lg:sticky lg:top-4 lg:self-start">
          <SuggestionFiltersForm basePath={SUGGESTIONS_PATH} query={query} values={params} activeCount={chips.length} />
        </aside>
        <section aria-label="Resultados" className="flex min-w-0 flex-col gap-4">
          <p aria-live="polite" className="text-lg text-wine">
            {pageResult.total === 1 ? "1 sugestão" : `${pageResult.total} sugestões`}
          </p>
          <ActiveFilterChips basePath={SUGGESTIONS_PATH} params={params} chips={chips} />
          <SuggestionsResults basePath={SUGGESTIONS_PATH} params={params} pageResult={pageResult} />
          <p className="text-sm text-wine/70">
            Valores são estimativas de 2026. O botão Ver na loja abre a busca oficial da loja, sem comprar nada por aqui.
          </p>
        </section>
      </div>
    </div>
  );
}
