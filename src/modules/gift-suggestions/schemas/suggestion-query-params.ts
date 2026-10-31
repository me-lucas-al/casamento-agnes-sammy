import { z } from "zod";
import { PRICE_BAND_IDS } from "@/modules/gifts/lib/pricing/price-band";
import { parsePageParams } from "@/shared/lib/pagination/pagination";
import { parsePriceRangeParams } from "@/shared/lib/url/price-params";
import { firstValue, textParam, type SearchParams } from "@/shared/lib/url/url-params";
import { SUGGESTION_CATEGORY_KEYS } from "../data/category-names";
import { PRODUCT_TYPE_IDS } from "../data/product-types";
import { isStoreId, type StoreId } from "../data/stores";
import {
  SUGGESTION_MODE_PARAMS,
  SUGGESTION_SORTS,
  type SuggestionModeParam,
  type SuggestionQuery,
} from "../lib/filters/suggestion-query";

const categorySchema = z.enum(SUGGESTION_CATEGORY_KEYS).optional().catch(undefined);
const typeSchema = z.enum(PRODUCT_TYPE_IDS).optional().catch(undefined);
const bandSchema = z.enum(PRICE_BAND_IDS).optional().catch(undefined);
const sortSchema = z.enum(SUGGESTION_SORTS).catch("relevancia");
const modeSchema = z.enum(Object.keys(SUGGESTION_MODE_PARAMS) as [SuggestionModeParam, ...SuggestionModeParam[]]).optional().catch(undefined);

function parseStores(rawValue: string | string[] | undefined): StoreId[] {
  const values = (Array.isArray(rawValue) ? rawValue : [rawValue]).flatMap((value) => (value ?? "").split(","));
  return [...new Set(values.map((value) => value.trim()).filter(isStoreId))];
}

export function parseSuggestionQuery(searchParams: SearchParams): SuggestionQuery {
  const modeParam = modeSchema.parse(firstValue(searchParams.modo));
  return {
    ...parsePageParams(searchParams),
    q: textParam(searchParams, "q"),
    stores: parseStores(searchParams.loja),
    category: categorySchema.parse(firstValue(searchParams.categoria)),
    type: typeSchema.parse(firstValue(searchParams.tipo)),
    ...parsePriceRangeParams(searchParams),
    band: bandSchema.parse(firstValue(searchParams.faixa)),
    mode: modeParam ? SUGGESTION_MODE_PARAMS[modeParam] : undefined,
    sort: sortSchema.parse(firstValue(searchParams.sort)),
  };
}
