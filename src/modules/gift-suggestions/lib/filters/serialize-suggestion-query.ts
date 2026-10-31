import type { SearchParams } from "@/shared/lib/url/url-params";
import { SUGGESTION_MODE_PARAMS, type SuggestionQuery } from "./suggestion-query";

function formatReais(cents: number | undefined): string | undefined {
  if (cents === undefined) return undefined;
  const reais = (cents / 100).toFixed(2).replace(".", ",");
  return reais.endsWith(",00") ? reais.slice(0, -3) : reais;
}

function modeParamOf(query: SuggestionQuery): string | undefined {
  return Object.entries(SUGGESTION_MODE_PARAMS).find(([, mode]) => mode === query.mode)?.[0];
}

export function serializeSuggestionQuery(query: SuggestionQuery): SearchParams {
  return {
    q: query.q || undefined,
    loja: query.stores.length > 0 ? query.stores.join(",") : undefined,
    categoria: query.category,
    tipo: query.type,
    precoMin: formatReais(query.minPriceCents),
    precoMax: formatReais(query.maxPriceCents),
    faixa: query.band,
    modo: modeParamOf(query),
    sort: query.sort === "relevancia" ? undefined : query.sort,
    perPage: query.perPage === 12 ? undefined : String(query.perPage),
    page: query.page > 1 ? String(query.page) : undefined,
  };
}
