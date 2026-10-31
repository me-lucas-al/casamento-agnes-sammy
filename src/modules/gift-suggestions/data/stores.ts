export const STORES = {
  magalu: "magazine-luiza",
  mercadoLivre: "mercado-livre",
  amazon: "amazon-br",
  casasBahia: "casas-bahia",
  americanas: "americanas",
  fastShop: "fast-shop",
  leroy: "leroy-merlin",
  tokStok: "tok-stok",
  camicado: "camicado",
  kabum: "kabum",
  ponto: "ponto",
  carrefour: "carrefour",
  shoptime: "shoptime",
} as const;

export type StoreId = (typeof STORES)[keyof typeof STORES];

export const STORE_IDS = Object.values(STORES) as [StoreId, ...StoreId[]];

export const STORE_LABELS: Record<StoreId, string> = {
  "magazine-luiza": "Magazine Luiza",
  "mercado-livre": "Mercado Livre",
  "amazon-br": "Amazon Brasil",
  "casas-bahia": "Casas Bahia",
  americanas: "Americanas",
  "fast-shop": "Fast Shop",
  "leroy-merlin": "Leroy Merlin",
  "tok-stok": "Tok&Stok",
  camicado: "Camicado",
  kabum: "KaBuM!",
  ponto: "Ponto",
  carrefour: "Carrefour",
  shoptime: "Shoptime",
};

export function isStoreId(value: string): value is StoreId {
  return STORE_IDS.some((storeId) => storeId === value);
}
