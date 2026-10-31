import type { CategoryInput } from "@/modules/gifts/types";

const DEFAULT_CATEGORY_NAMES = [
  "Cozinha & Eletrodomésticos",
  "Sala & Decoração",
  "Quarto & Banho",
  "Lua de Mel & Experiências",
  "Casa Nova / Cotas Livres",
  "Divertidos / Zoeira",
] as const;

export const DEFAULT_CATEGORIES: readonly CategoryInput[] = DEFAULT_CATEGORY_NAMES.map((name, index) => ({
  name,
  sortOrder: index,
}));
