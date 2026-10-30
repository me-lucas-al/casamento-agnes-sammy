import { GiftCard } from "@/modules/gifts/components/gift-card";
import { GiftFilters } from "@/modules/gifts/components/gift-filters";
import { listGiftCategoriesQuery, listVisibleGiftsPageQuery } from "@/modules/gifts/controllers/gifts.queries";
import { parseGiftListParams } from "@/modules/gifts/schemas/gift-list-params";
import { EmptyState } from "@/shared/ui/empty-state";
import { PaginationControls } from "@/shared/ui/pagination-controls";
import type { SearchParams } from "@/shared/lib/url-params";
import { PageHeading } from "@/shared/ui/components/page-heading";

type GiftsPageProps = { searchParams: Promise<SearchParams> };

export default async function GiftsPage({ searchParams }: GiftsPageProps) {
  const resolvedSearchParams = await searchParams;
  const [pageResult, categories] = await Promise.all([
    listVisibleGiftsPageQuery(resolvedSearchParams),
    listGiftCategoriesQuery(),
  ]);

  return (
    <div className="mx-auto flex w-full max-w-6xl flex-col gap-6">
      <PageHeading title="Lista de presentes" description="Cada presente é um carinho. Escolha com o coração, no seu tempo." />
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
