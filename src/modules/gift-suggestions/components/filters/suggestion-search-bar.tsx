import { Search } from "lucide-react";
import { firstValue, type SearchParams } from "@/shared/lib/url-params";

type SuggestionSearchBarProps = {
  basePath: string;
  params: SearchParams;
};

const KEPT_PARAM_NAMES = ["loja", "categoria", "tipo", "precoMin", "precoMax", "faixa", "modo", "sort", "perPage"];

export function SuggestionSearchBar({ basePath, params }: SuggestionSearchBarProps) {
  return (
    <form action={basePath} method="get" role="search" aria-label="Buscar sugestões" className="flex gap-2">
      {KEPT_PARAM_NAMES.map((name) => {
        const value = firstValue(params[name]);
        return value ? <input key={name} type="hidden" name={name} value={value} /> : null;
      })}
      <input
        type="search"
        name="q"
        defaultValue={firstValue(params.q) ?? ""}
        placeholder="Buscar por nome, tipo ou loja"
        aria-label="Buscar sugestões"
        className="min-h-11 w-full rounded-full border border-gold/60 bg-white px-5 text-base text-wine outline-none focus:border-rose"
      />
      <button
        type="submit"
        className="flex min-h-11 shrink-0 items-center gap-2 rounded-full bg-crimson px-5 text-base font-semibold text-paper hover:bg-wine"
      >
        <Search aria-hidden className="size-4" />
        <span className="max-sm:sr-only">Buscar</span>
      </button>
    </form>
  );
}
