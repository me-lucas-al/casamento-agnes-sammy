import { GIFT_SORT_LABELS, GIFT_SORT_OPTIONS } from "@/modules/gifts/lib/listing/gift-sort";
import type { GiftListInput } from "@/modules/gifts/lib/listing/gift-list-input";
import { formatCentsForInput } from "@/modules/gifts/lib/drafts/gift-form-values";
import { fieldControlClassName } from "../form/form-field";

type GuestGiftFiltersProps = {
  basePath: string;
  current: GiftListInput;
};

export function GuestGiftFilters({ basePath, current }: GuestGiftFiltersProps) {
  return (
    <form action={basePath} method="get" className="grid grid-cols-2 gap-3 sm:grid-cols-4 lg:grid-cols-[2fr_1fr_1fr_1fr_auto]">
      <input type="hidden" name="perPage" value={current.perPage} />
      <input
        type="search"
        name="q"
        defaultValue={current.search}
        placeholder="Buscar presente"
        aria-label="Buscar presente"
        className={`${fieldControlClassName} col-span-2 sm:col-span-4 lg:col-span-1`}
      />
      <input
        type="text"
        inputMode="decimal"
        name="precoMin"
        defaultValue={formatCentsForInput(current.minPriceCents ?? null)}
        placeholder="Preço mínimo (R$)"
        aria-label="Preço mínimo em reais"
        className={fieldControlClassName}
      />
      <input
        type="text"
        inputMode="decimal"
        name="precoMax"
        defaultValue={formatCentsForInput(current.maxPriceCents ?? null)}
        placeholder="Preço máximo (R$)"
        aria-label="Preço máximo em reais"
        className={fieldControlClassName}
      />
      <select name="sort" defaultValue={current.sort} aria-label="Ordenar" className={`${fieldControlClassName} col-span-2 sm:col-span-2 lg:col-span-1`}>
        {GIFT_SORT_OPTIONS.map((option) => (
          <option key={option} value={option}>{GIFT_SORT_LABELS[option]}</option>
        ))}
      </select>
      <button type="submit" className="col-span-2 min-h-11 rounded-lg bg-rose px-4 py-2 text-base font-medium text-white hover:bg-crimson sm:col-span-2 lg:col-span-1">
        Filtrar
      </button>
    </form>
  );
}
