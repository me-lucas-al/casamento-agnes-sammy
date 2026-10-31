# Pesquisa de sugestões de presentes

Data: 2026-10-31

## Resumo

Catálogo estático de 262 sugestões genéricas (sem marcas, sem fotos, sem texto copiado) para as seis categorias da lista:

| Categoria | Sugestões |
| --- | --- |
| Cozinha & Eletrodomésticos | 61 |
| Sala & Decoração | 45 |
| Quarto & Banho | 44 |
| Lua de Mel & Experiências | 37 |
| Casa Nova / Cotas Livres | 39 |
| Divertidos / Zoeira | 36 |

Cada sugestão tem nome, descrição de uma frase em pt-BR (texto original), categoria, tipo de produto, loja, preço em centavos, tipo (`item` ou `experience`), modo (`single`, `fixed_quotas` ou `free_amount`), faixa de preço e tags de busca. Código em `src/modules/gift-suggestions/data`.

## Fontes consultadas

Guias, listas e páginas de lojas usados para decidir quais itens aparecem com mais frequência em listas brasileiras:

- Cozinha e eletrodomésticos: [Casa dos Eletrodomésticos (lista de casamento, cozinha)](https://www.casadoseletrodomesticos.com.br/presentes/ocasiao/presentes-casamento-cozinha), [Casa dos Eletrodomésticos (eletrodomésticos)](https://www.casadoseletrodomesticos.com.br/presentes/ocasiao/presentes-casamento-eletrodomesticos), [Mercado Livre, itens essenciais para a lista](https://www.mercadolivre.com.br/blog/lista-de-presentes-de-casamento), [Electrolux, eletrodomésticos para a lista](https://loja.electrolux.com.br/inspira/blog/eletrodomesticos-para-colocar-na-lista-de-casamento), [Casamentos.com.br, melhores presentes para a cozinha](https://www.casamentos.com.br/artigos/lista-de-casamento-dicas-para-pedir-os-melhores-presentes-para-a-cozinha--c5148), [iCasei, chá de cozinha](https://revista.icasei.com.br/cha-de-cozinha), [Folha Vitória, presentes coringa](https://www.folhavitoria.com.br/geral/aparelhos-de-jantar-e-eletrodomesticos-sao-opcoes-coringa-de-presentes-de-casamento/)
- Sala, quarto e banho: [Zap Imóveis, chá de casa nova](https://www.zapimoveis.com.br/blog/casa-e-decoracao/cha-de-casa-nova/), [QuintoAndar, lista de casa nova](https://www.quintoandar.com.br/guias/?p=455429), [Casamentos.com.br, chá de casa nova](https://www.casamentos.com.br/artigos/cha-de-casa-nova--c11017), [Casamentos.com.br, itens indispensáveis para o quarto](https://www.casamentos.com.br/artigos/lista-de-presentes-itens-indispensaveis-para-o-quarto--c5385), [Casamentos.com.br, chá de banheiro](https://www.casamentos.com.br/artigos/cha-de-banheiro-saiba-como-fazer-a-lista-de-presentes-perfeita--c7306), [Buscapé, organizar a lista de casa nova](https://www.buscape.com.br/panelas/conteudo/cha-de-casa-nova-como-organizar-a-lista-de-presentes), [Camicado nas listas do Casamentos.com.br](https://www.casamentos.com.br/lista-de-casamento/camicado--e141367), [Casamentos.com.br, lista de presentes](https://www.casamentos.com.br/artigos/lista-de-presentes--c4908)
- Lua de mel e experiências: [Canaltech, como funciona o iCasei](https://canaltech.com.br/internet/como-funciona-o-site-de-casamentos-icasei/), [Catraca Livre, destinos de lua de mel para 2026](https://catracalivre.com.br/viagem-livre/os-destinos-de-lua-de-mel-queridinhos-para-2026/), [Catraca Livre, praias brasileiras para lua de mel](https://catracalivre.com.br/viagem-livre/praias-brasileiras-mais-escolhidas-lua-de-mel/), [Casamentos.com.br, lua de mel](https://www.casamentos.com.br/artigos/lua-de-mel--t7), [Meu Bolso em Dia, lua de mel dos sonhos](https://meubolsoemdia.com.br/Materias/lua-de-mel-dos-sonhos-como-se-organizar-para-ela)
- Casa nova e cotas livres: [Casamentos.com.br, 5 ideias de presentes](https://www.casamentos.com.br/artigos/5-ideias-para-presentes-de-casamento--c4812), [Casamentos.com.br, lista online](https://www.casamentos.com.br/artigos/lista-online-de-casamentos--c5737), [Serasa, como fazer a lista](https://www.serasa.com.br/blog/como-fazer-lista-de-casamento-acerte-na-escolha/), [Shopee Blog (apenas referência de ideias, nenhuma loja Shopee é usada)](https://shopee.com.br/blog/lista-de-presente-de-casamento/)
- Divertidos: [Casamentos.com.br, presentes criativos até R$ 100](https://www.casamentos.com.br/artigos/presentes-de-casamento-criativos-de-menos-de-r-100-00--c9980), [Casamentos.com.br, 5 ideias](https://www.casamentos.com.br/artigos/5-ideias-para-presentes-de-casamento--c4812). As ideias de humor são originais, escritas para este projeto.
- Referência de preços de eletrodomésticos grandes: listagens do Magazine Luiza e do Casas Bahia (máquina de lavar de 13 a 17 kg entre R$ 1.480 e R$ 2.630, geladeira de 385 a 480 L entre R$ 3.000 e R$ 3.600), via [Catraca Livre](https://catracalivre.com.br/noticias/quanto-custa-trocar-todos-os-eletrodomesticos-da-casa/).

## Lojas permitidas

Somente lojas conhecidas e de confiança. A lista é um enum fechado (`STORES` em `data/stores.ts`) e um teste falha se aparecer qualquer outra:

Magazine Luiza, Mercado Livre, Amazon Brasil, Casas Bahia, Americanas, Fast Shop, Leroy Merlin, Tok&Stok, Camicado, KaBuM!, Ponto (Ponto Frio), Carrefour e Shoptime.

Proibidos: Shopee, AliExpress, Shein, Temu, Wish, Alibaba e qualquer marketplace ou loja desconhecida.

Regras:

- Cada sugestão física tem `store` e `storeSearchUrl`. Experiências, cotas livres e itens de humor sem produto têm `store = null` e `storeSearchUrl = null`.
- `storeSearchUrl` é sempre a URL de busca da loja pelo termo do produto, gerada pela função pura `buildStoreSearchUrl(loja, termo)` em `lib/build-store-search-url.ts`. Nunca existe URL de página de produto específico.
- Apenas `https`. O teste de catálogo confere o protocolo e o domínio esperado de cada loja (`lib/is-allowed-store-url.ts`).
- Os padrões de URL de busca de Magazine Luiza, Mercado Livre e Amazon seguem os exemplos oficiais. Os das demais lojas seguem o padrão público de busca de cada site e devem ser reconferidos se alguma loja mudar o formato.
- O botão "Ver na loja" abre em nova aba com `rel="noopener noreferrer"`. Nada é comprado pelo site.

## Premissas de preço

- Valores são estimativas realistas para 2026 em BRL, arredondados para múltiplos de R$ 5. Não foram copiados de anúncios e não têm marca.
- Objetos usam `single`. Itens caros (geladeira, lava-louças, sofá, TV, cama box, ar-condicionado, máquinas de lavar) usam `fixed_quotas`, com cotas em reais inteiros (por exemplo, geladeira de R$ 4.000 em 10 cotas de R$ 400).
- Fundos de lua de mel, casa nova e divertidos usam `free_amount`, com valor mínimo entre R$ 10 e R$ 50 e meta total como `priceCents`.
- `priceBand` segue as faixas existentes do módulo de presentes: até R$ 100, R$ 100 a R$ 300, R$ 300 a R$ 600 e acima de R$ 600.
- As sugestões só entram na lista quando o casal clica. Depois de adicionadas, preço, foto e visibilidade podem ser editados em `/painel/presentes`.
