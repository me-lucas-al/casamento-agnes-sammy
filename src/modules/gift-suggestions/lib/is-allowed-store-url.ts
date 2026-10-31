import type { StoreId } from "../data/stores";

const STORE_HOSTS: Record<StoreId, string> = {
  "magazine-luiza": "www.magazineluiza.com.br",
  "mercado-livre": "lista.mercadolivre.com.br",
  "amazon-br": "www.amazon.com.br",
  "casas-bahia": "www.casasbahia.com.br",
  americanas: "www.americanas.com.br",
  "fast-shop": "www.fastshop.com.br",
  "leroy-merlin": "www.leroymerlin.com.br",
  "tok-stok": "www.tokstok.com.br",
  camicado: "www.camicado.com.br",
  kabum: "www.kabum.com.br",
  ponto: "www.pontofrio.com.br",
  carrefour: "www.carrefour.com.br",
  shoptime: "www.shoptime.com.br",
};

export function isAllowedStoreUrl(store: StoreId, url: string): boolean {
  if (!URL.canParse(url)) return false;
  const parsed = new URL(url);
  return parsed.protocol === "https:" && parsed.hostname === STORE_HOSTS[store];
}
