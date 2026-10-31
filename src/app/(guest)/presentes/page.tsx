import { GiftCard } from "@/modules/gifts/components/cards/gift-card";
import { GuestGiftFilters } from "@/modules/gifts/components/filters/guest-gift-filters";
import { listVisibleGiftsPageQuery } from "@/modules/gifts/controllers/queries/gifts.queries";
import { parseGuestGiftListParams } from "@/modules/gifts/schemas/guest-gift-list-params";
import { EmptyState } from "@/shared/ui/feedback/empty-state";
import { PaginationControls } from "@/shared/ui/navigation/pagination-controls";
import type { SearchParams } from "@/shared/lib/url/url-params";
import { PageHeading } from "@/shared/ui/layout/page-heading";

type GiftsPageProps = { searchParams: Promise<SearchParams> };

export default async function GiftsPage({ searchParams }: GiftsPageProps) {
  const resolvedSearchParams = await searchParams;
  const pageResult = await listVisibleGiftsPageQuery(resolvedSearchParams);

  return (
    <div className="mx-auto flex w-full max-w-6xl flex-col gap-6">
      <PageHeading title="Lista de presentes" description="Cada presente é um carinho. Escolha com o coração, no seu tempo." />
      <GuestGiftFilters basePath="/presentes" current={parseGuestGiftListParams(resolvedSearchParams)} />
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
