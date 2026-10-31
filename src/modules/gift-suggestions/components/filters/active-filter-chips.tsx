import Link from "next/link";
import { X } from "lucide-react";
import { buildQueryString, type QueryChanges, type SearchParams } from "@/shared/lib/url/url-params";
import type { FilterChip } from "@/modules/gift-suggestions/lib/filters/active-filter-chips";

type ActiveFilterChipsProps = {
  basePath: string;
  params: SearchParams;
  chips: FilterChip[];
};

function hrefWith(basePath: string, params: SearchParams, changes: QueryChanges): string {
  return `${basePath}${buildQueryString(params, { ...changes, page: null })}`;
}

export function ActiveFilterChips({ basePath, params, chips }: ActiveFilterChipsProps) {
  if (chips.length === 0) return null;
  const clearHref = `${basePath}${buildQueryString({ sort: params.sort, perPage: params.perPage }, {})}`;
  return (
    <ul aria-label="Filtros ativos" className="flex flex-wrap items-center gap-2">
      {chips.map((chip) => (
        <li key={chip.id}>
          <Link
            href={hrefWith(basePath, params, chip.removal)}
            className="inline-flex min-h-11 items-center gap-1.5 rounded-full bg-blush px-4 text-sm font-medium text-wine hover:bg-rose/20"
          >
            {chip.label}
            <X aria-hidden className="size-4" />
            <span className="sr-only">Remover filtro</span>
          </Link>
        </li>
      ))}
      <li>
        <Link href={clearHref} className="inline-flex min-h-11 items-center px-3 text-sm font-semibold text-crimson underline underline-offset-4">
          Limpar filtros
        </Link>
      </li>
    </ul>
  );
}
