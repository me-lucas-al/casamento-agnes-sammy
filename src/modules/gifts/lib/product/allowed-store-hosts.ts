export const STORE_NAME_BY_HOST: Readonly<Record<string, string>> = {
  "www.magazineluiza.com.br": "Magazine Luiza",
  "www.mercadolivre.com.br": "Mercado Livre",
  "produto.mercadolivre.com.br": "Mercado Livre",
  "www.amazon.com.br": "Amazon",
  "www.casasbahia.com.br": "Casas Bahia",
  "www.americanas.com.br": "Americanas",
  "www.fastshop.com.br": "Fast Shop",
  "www.leroymerlin.com.br": "Leroy Merlin",
  "www.tokstok.com.br": "Tok&Stok",
  "www.camicado.com.br": "Camicado",
  "www.kabum.com.br": "KaBuM!",
  "www.pontofrio.com.br": "Ponto",
  "www.carrefour.com.br": "Carrefour",
  "www.shoptime.com.br": "Shoptime",
};

export const ALLOWED_STORE_HOSTS: readonly string[] = Object.keys(STORE_NAME_BY_HOST);
