import { isPriceInBand, PRICE_BANDS, type PriceBandId } from "@/modules/gifts/lib/price-band";
import type { GiftKind } from "@/modules/gifts/types";
import { buildStoreSearchUrl } from "../lib/build-store-search-url";
import { normalizeGiftName } from "../lib/normalize-gift-name";
import type { GiftSuggestion } from "../types";
import { categoryNameOf, type SuggestionCategoryKey } from "./category-names";
import type { ProductTypeId } from "./product-types";
import type { StoreId } from "./stores";

type BuilderContext = {
  categoryKey: SuggestionCategoryKey;
  type: ProductTypeId;
  kind: GiftKind;
};

function bandOf(priceCents: number): PriceBandId {
  const band = PRICE_BANDS.find((candidate) => isPriceInBand(priceCents, candidate));
  if (!band) throw new Error(`No price band for ${priceCents}`);
  return band.id;
}

function slugify(text: string): string {
  return normalizeGiftName(text).replace(/[^a-z0-9]+/g, "-").replace(/^-|-$/g, "");
}

function buildBase(context: BuilderContext, name: string, description: string, priceCents: number, tags: string) {
  return {
    id: `${context.categoryKey}-${slugify(name)}`,
    categoryKey: context.categoryKey,
    categoryName: categoryNameOf(context.categoryKey),
    name,
    description,
    kind: context.kind,
    type: context.type,
    priceCents,
    priceBand: bandOf(priceCents),
    tags: tags.split(" ").filter(Boolean),
  };
}

function storeFields(store: StoreId | null, searchTerm: string) {
  return { store, storeSearchUrl: store ? buildStoreSearchUrl(store, searchTerm) : null };
}

export function suggestionBuilders(categoryKey: SuggestionCategoryKey, type: ProductTypeId, kind: GiftKind = "item") {
  const context: BuilderContext = { categoryKey, type, kind };
  return {
    single(name: string, description: string, priceCents: number, store: StoreId | null, tags: string, searchTerm = name): GiftSuggestion {
      return { ...buildBase(context, name, description, priceCents, tags), mode: "single", ...storeFields(store, searchTerm) };
    },
    quota(name: string, description: string, priceCents: number, totalQuotas: number, store: StoreId | null, tags: string, searchTerm = name): GiftSuggestion {
      return { ...buildBase(context, name, description, priceCents, tags), mode: "fixed_quotas", totalQuotas, ...storeFields(store, searchTerm) };
    },
    fund(name: string, description: string, priceCents: number, minAmountCents: number, tags: string): GiftSuggestion {
      return { ...buildBase(context, name, description, priceCents, tags), mode: "free_amount", minAmountCents, ...storeFields(null, name) };
    },
  };
}
