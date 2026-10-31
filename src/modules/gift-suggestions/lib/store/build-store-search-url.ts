import { normalizeGiftName } from "../catalog/normalize-gift-name";
import type { StoreId } from "@/modules/gift-suggestions/data/stores";

type SearchUrlBuilder = (term: string) => string;

function searchWords(term: string): string[] {
  return normalizeGiftName(term).replace(/[^a-z0-9 ]/g, " ").split(" ").filter(Boolean);
}

const plus = (term: string) => searchWords(term).join("+");
const hyphen = (term: string) => searchWords(term).join("-");
const percent = (term: string) => encodeURIComponent(searchWords(term).join(" "));

const SEARCH_URL_BUILDERS: Record<StoreId, SearchUrlBuilder> = {
  "magazine-luiza": (term) => `https://www.magazineluiza.com.br/busca/${plus(term)}/`,
  "mercado-livre": (term) => `https://lista.mercadolivre.com.br/${hyphen(term)}`,
  "amazon-br": (term) => `https://www.amazon.com.br/s?k=${plus(term)}`,
  "casas-bahia": (term) => `https://www.casasbahia.com.br/${hyphen(term)}/b`,
  americanas: (term) => `https://www.americanas.com.br/busca/${hyphen(term)}`,
  "fast-shop": (term) => `https://www.fastshop.com.br/web/s/${percent(term)}`,
  "leroy-merlin": (term) => `https://www.leroymerlin.com.br/search?term=${percent(term)}`,
  "tok-stok": (term) => `https://www.tokstok.com.br/${hyphen(term)}?_q=${plus(term)}&map=ft`,
  camicado: (term) => `https://www.camicado.com.br/${hyphen(term)}?_q=${plus(term)}&map=ft`,
  kabum: (term) => `https://www.kabum.com.br/busca/${hyphen(term)}`,
  ponto: (term) => `https://www.pontofrio.com.br/${hyphen(term)}/b`,
  carrefour: (term) => `https://www.carrefour.com.br/busca/${percent(term)}`,
  shoptime: (term) => `https://www.shoptime.com.br/busca/${hyphen(term)}`,
};

export function buildStoreSearchUrl(store: StoreId, term: string): string {
  return SEARCH_URL_BUILDERS[store](term);
}
