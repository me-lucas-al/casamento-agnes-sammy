import type { SuggestionCategoryKey } from "@/modules/gift-suggestions/data/category-names";

const CATEGORY_KEY_BY_FILE: Readonly<Record<string, SuggestionCategoryKey>> = {
  "cozinha-eletro": "cozinha",
  "cozinha-utensilios": "cozinha",
  "sala-decoracao": "sala",
  "quarto-banho": "quarto-banho",
  divertidos: "divertidos",
};

export function categoryKeyOfResearchFile(fileName: string): SuggestionCategoryKey | null {
  return CATEGORY_KEY_BY_FILE[fileName.replace(/\.json$/, "")] ?? null;
}
