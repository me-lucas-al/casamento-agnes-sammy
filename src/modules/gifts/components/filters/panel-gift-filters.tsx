import { GIFT_SORT_LABELS, GIFT_SORT_OPTIONS } from "@/modules/gifts/lib/listing/gift-sort";
import { PRICE_BANDS } from "@/modules/gifts/lib/pricing/price-band";
import type { GiftListInput } from "@/modules/gifts/lib/listing/gift-list-input";
import type { GiftCategory } from "@/modules/gifts/types";
import { fieldControlClassName } from "../form/form-field";

type GiftFiltersProps = {
  basePath: string;
  categories: GiftCategory[];
  current: GiftListInput;
};

export function GiftFilters({ basePath, categories, current }: GiftFiltersProps) {
  return (
    <form action={basePath} method="get" className="grid grid-cols-1 gap-3 sm:grid-cols-2 lg:grid-cols-5">
      <input type="hidden" name="perPage" value={current.perPage} />
      <input
        type="search"
        name="search"
        defaultValue={current.search}
        placeholder="Buscar presente"
        aria-label="Buscar presente"
        className={fieldControlClassName}
      />
      <select name="category" defaultValue={current.categoryId ?? ""} aria-label="Categoria" className={fieldControlClassName}>
        <option value="">Todas as categorias</option>
        {categories.map((category) => (
          <option key={category.id} value={category.id}>{category.name}</option>
        ))}
      </select>
      <select name="band" defaultValue={current.band?.id ?? ""} aria-label="Faixa de valor" className={fieldControlClassName}>
        <option value="">Qualquer valor</option>
        {PRICE_BANDS.map((band) => (
          <option key={band.id} value={band.id}>{band.label}</option>
        ))}
      </select>
      <select name="sort" defaultValue={current.sort} aria-label="Ordenar" className={fieldControlClassName}>
        {GIFT_SORT_OPTIONS.map((option) => (
          <option key={option} value={option}>{GIFT_SORT_LABELS[option]}</option>
        ))}
      </select>
      <button type="submit" className="rounded-lg bg-rose px-4 py-2 text-base font-medium text-white hover:bg-crimson">
        Filtrar
      </button>
    </form>
  );
}
