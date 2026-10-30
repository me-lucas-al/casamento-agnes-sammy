import { GiftCard } from "@/modules/gifts/components/gift-card";
import { GiftFilters } from "@/modules/gifts/components/gift-filters";
import { listGiftCategoriesQuery, listVisibleGiftsPageQuery } from "@/modules/gifts/controllers/gifts.queries";
import { parseGiftListParams } from "@/modules/gifts/schemas/gift-list-params";
import { EmptyState } from "@/shared/ui/empty-state";
import { PaginationControls } from "@/shared/ui/pagination-controls";
import type { SearchParams } from "@/shared/lib/url-params";

type GiftsPageProps = { searchParams: Promise<SearchParams> };

export default async function GiftsPage({ searchParams }: GiftsPageProps) {
  const resolvedSearchParams = await searchParams;
  const [pageResult, categories] = await Promise.all([
    listVisibleGiftsPageQuery(resolvedSearchParams),
    listGiftCategoriesQuery(),
  ]);

  return (
    <div className="mx-auto flex w-full max-w-6xl flex-col gap-6">
      <h1 className="font-serif text-3xl italic text-wine">Lista de presentes</h1>
      <GiftFilters basePath="/presentes" categories={categories} current={parseGiftListParams(resolvedSearchParams)} />
      {pageResult.items.length === 0 ? (
        <EmptyState title="Nenhum presente encontrado" description="Tente mudar os filtros da busca." />
      ) : (
        <ul className="grid grid-cols-1 gap-4 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4">
          {pageResult.items.map((gift) => (
            <GiftCard key={gift.id} gift={gift} />
          ))}
        </ul>
      )}
      <PaginationControls basePath="/presentes" searchParams={resolvedSearchParams} pageResult={pageResult} />
    </div>
  );
}
