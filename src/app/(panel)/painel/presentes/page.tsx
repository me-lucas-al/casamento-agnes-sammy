import Link from "next/link";
import { PanelGiftFilters } from "@/modules/gifts/components/filters/panel-gift-filters";
import { PanelGiftCard } from "@/modules/gifts/components/cards/panel-gift-card";
import { listGiftCategoriesQuery, listPanelGiftsPageQuery } from "@/modules/gifts/controllers/queries/gifts.queries";
import { parseGiftListParams } from "@/modules/gifts/schemas/gift-list-params";
import type { SearchParams } from "@/shared/lib/url/url-params";
import { buttonVariants } from "@/shared/ui/primitives/button";
import { EmptyState } from "@/shared/ui/feedback/empty-state";
import { PaginationControls } from "@/shared/ui/navigation/pagination-controls";
import { PageHeading } from "@/shared/ui/layout/page-heading";

type PanelGiftsPageProps = { searchParams: Promise<SearchParams> };

export default async function PanelGiftsPage({ searchParams }: PanelGiftsPageProps) {
  const resolvedSearchParams = await searchParams;
  const [pageResult, categories] = await Promise.all([
    listPanelGiftsPageQuery(resolvedSearchParams),
    listGiftCategoriesQuery(),
  ]);

  return (
    <div className="flex w-full flex-col gap-6">
      <div className="flex flex-wrap items-center justify-between gap-3">
        <PageHeading title="Presentes" description="Acompanhe a lista e o que já foi presenteado." align="start" />
        <div className="flex flex-wrap gap-2">
          <Link href="/painel/presentes/categorias" className={buttonVariants({ variant: "outline" })}>
            Categorias
          </Link>
          <Link href="/painel/presentes/sugestoes" className={buttonVariants({ variant: "outline" })}>
            Sugestões
          </Link>
          <Link href="/painel/presentes/novo" className={buttonVariants()}>
            Novo presente
          </Link>
        </div>
      </div>
      <PanelGiftFilters basePath="/painel/presentes" categories={categories} current={parseGiftListParams(resolvedSearchParams)} />
      {pageResult.items.length === 0 ? (
        <EmptyState title="Nenhum presente cadastrado" description="Crie categorias e adicione o primeiro presente." />
      ) : (
        <ul className="grid grid-cols-1 gap-4 sm:grid-cols-2 xl:grid-cols-3">
          {pageResult.items.map((gift) => (
            <PanelGiftCard key={gift.id} gift={gift} />
          ))}
        </ul>
      )}
      <PaginationControls basePath="/painel/presentes" searchParams={resolvedSearchParams} pageResult={pageResult} />
    </div>
  );
}
