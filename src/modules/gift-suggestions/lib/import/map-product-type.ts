import type { ProductTypeId } from "@/modules/gift-suggestions/data/product-types";
import type { SuggestionCategoryKey } from "@/modules/gift-suggestions/data/category-names";
import { normalizeGiftName } from "../catalog/normalize-gift-name";

const TYPE_BY_KEYWORD: readonly (readonly [string, ProductTypeId])[] = [
  ["eletroportatil", "eletroportatil"],
  ["eletrodomestico", "eletrodomestico"],
  ["eletronico", "eletronico"],
  ["utensilio", "utensilio"],
  ["mesa", "mesa-posta"],
  ["cama", "cama-banho"],
  ["banho", "cama-banho"],
  ["toalha", "cama-banho"],
  ["decoracao", "decoracao"],
  ["movel", "movel"],
  ["organizacao", "organizacao"],
  ["ferramenta", "ferramenta"],
  ["jogo", "divertido"],
  ["divertido", "divertido"],
];

const DEFAULT_TYPE_BY_CATEGORY: Partial<Record<SuggestionCategoryKey, ProductTypeId>> = {
  cozinha: "utensilio",
  sala: "decoracao",
  "quarto-banho": "cama-banho",
  divertidos: "divertido",
};

export function mapProductType(label: string, categoryKey: SuggestionCategoryKey): ProductTypeId {
  const normalized = normalizeGiftName(label);
  const match = TYPE_BY_KEYWORD.find(([keyword]) => normalized.includes(keyword));
  return match?.[1] ?? DEFAULT_TYPE_BY_CATEGORY[categoryKey] ?? "decoracao";
}
