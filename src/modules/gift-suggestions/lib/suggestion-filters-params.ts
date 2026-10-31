import { PRICE_BAND_IDS } from "@/modules/gifts/lib/price-band";
import { enumParam, textParam, type SearchParams } from "@/shared/lib/url-params";
import type { SuggestionFilters } from "./filter-suggestions";

export function parseSuggestionFilters(searchParams: SearchParams): SuggestionFilters {
  return {
    search: textParam(searchParams, "search"),
    band: enumParam(searchParams, "band", PRICE_BAND_IDS),
  };
}
