import { PaymentCard } from "@/modules/contributions/components/payment-card";
import { PaymentsFiltersForm } from "@/modules/contributions/components/payments-filters-form";
import { listPendingPaymentsQuery } from "@/modules/contributions/controllers/queries/contributions.queries";
import { parsePaymentsFilters } from "@/modules/contributions/schemas/payments-filters.schema";
import type { SearchParams } from "@/shared/lib/url-params";
import { EmptyState } from "@/shared/ui/empty-state";
import { PaginationControls } from "@/shared/ui/pagination-controls";
import { PageHeading } from "@/shared/ui/components/page-heading";

export const dynamic = "force-dynamic";

type PageProps = { searchParams: Promise<SearchParams> };

export default async function PaymentsPage({ searchParams }: PageProps) {
  const params = await searchParams;
  const pageResult = await listPendingPaymentsQuery(params);

  return (
    <div className="flex flex-col gap-4">
      <PageHeading title="Pagamentos" description="Confira os Pix recebidos e confirme os presentes." align="start" />
      <PaymentsFiltersForm filters={parsePaymentsFilters(params)} />
      {pageResult.items.length === 0 ? (
        <EmptyState title="Nenhum pagamento encontrado." />
      ) : (
        <ul className="grid grid-cols-1 gap-3 lg:grid-cols-2">
          {pageResult.items.map((payment) => (
            <PaymentCard key={payment.id} payment={payment} />
          ))}
        </ul>
      )}
      <PaginationControls basePath="/painel/pagamentos" searchParams={params} pageResult={pageResult} />
    </div>
  );
}
