import { PAYMENT_STATUS_FILTERS, type PaymentsFilters } from "../schemas/payments-filters.schema";
import { CONTRIBUTION_STATUS_LABELS } from "../lib/describe-availability";

type PaymentsFiltersFormProps = {
  filters: PaymentsFilters;
};

const SORT_LABELS = {
  newest: "Mais recentes",
  oldest: "Mais antigos",
  amount: "Maior valor",
  expires: "Expira primeiro",
} as const;

const fieldClassName = "w-full rounded-lg border bg-white px-3 py-2 text-sm";

export function PaymentsFiltersForm({ filters }: PaymentsFiltersFormProps) {
  return (
    <form method="get" className="grid grid-cols-1 gap-3 sm:grid-cols-4">
      <input
        name="search"
        defaultValue={filters.search}
        placeholder="Buscar convidado ou presente"
        className={fieldClassName}
      />
      <select name="status" defaultValue={filters.status} className={fieldClassName}>
        {PAYMENT_STATUS_FILTERS.map((status) => (
          <option key={status} value={status}>
            {status === "all" ? "Todos" : CONTRIBUTION_STATUS_LABELS[status]}
          </option>
        ))}
      </select>
      <select name="sort" defaultValue={filters.sort} className={fieldClassName}>
        {Object.entries(SORT_LABELS).map(([value, label]) => (
          <option key={value} value={value}>
            {label}
          </option>
        ))}
      </select>
      <button type="submit" className="rounded-lg bg-wine px-3 py-2 text-sm text-white">
        Filtrar
      </button>
    </form>
  );
}
