export const PRODUCT_TYPE_LABELS = {
  eletrodomestico: "Eletrodoméstico",
  eletroportatil: "Eletroportátil",
  utensilio: "Utensílio de cozinha",
  "mesa-posta": "Mesa posta",
  "cama-banho": "Cama, mesa e banho",
  decoracao: "Decoração",
  movel: "Móvel",
  eletronico: "Eletrônico",
  ferramenta: "Ferramenta e reparo",
  organizacao: "Organização e limpeza",
  experiencia: "Experiência",
  "cota-livre": "Cota livre",
  divertido: "Divertido",
} as const;

export type ProductTypeId = keyof typeof PRODUCT_TYPE_LABELS;

export const PRODUCT_TYPE_IDS = Object.keys(PRODUCT_TYPE_LABELS) as [ProductTypeId, ...ProductTypeId[]];

export const STORELESS_TYPES: readonly ProductTypeId[] = ["cota-livre"];
