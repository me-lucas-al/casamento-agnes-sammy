export const SUGGESTION_CATEGORIES = [
  { key: "cozinha", name: "Cozinha & Eletrodomésticos" },
  { key: "sala", name: "Sala & Decoração" },
  { key: "quarto-banho", name: "Quarto & Banho" },
  { key: "lua-de-mel", name: "Lua de Mel & Experiências" },
  { key: "casa-nova", name: "Casa Nova / Cotas Livres" },
  { key: "divertidos", name: "Divertidos / Zoeira" },
] as const;

export type SuggestionCategoryKey = (typeof SUGGESTION_CATEGORIES)[number]["key"];

export const SUGGESTION_CATEGORY_KEYS = SUGGESTION_CATEGORIES.map((category) => category.key) as [
  SuggestionCategoryKey,
  ...SuggestionCategoryKey[],
];

export const SUGGESTION_CATEGORY_ORDER: readonly string[] = SUGGESTION_CATEGORIES.map((category) => category.name);

export function categoryNameOf(key: SuggestionCategoryKey): string {
  const category = SUGGESTION_CATEGORIES.find((candidate) => candidate.key === key);
  if (!category) throw new Error(`Unknown suggestion category ${key}`);
  return category.name;
}
