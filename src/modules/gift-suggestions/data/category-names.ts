export const SUGGESTION_CATEGORY_NAMES = {
  kitchen: "Cozinha & Eletrodomésticos",
  livingRoom: "Sala & Decoração",
  bedroomBath: "Quarto & Banho",
  honeymoon: "Lua de Mel & Experiências",
  newHome: "Casa Nova / Cotas Livres",
  fun: "Divertidos / Zoeira",
} as const;

export const SUGGESTION_CATEGORY_ORDER: readonly string[] = Object.values(SUGGESTION_CATEGORY_NAMES);
