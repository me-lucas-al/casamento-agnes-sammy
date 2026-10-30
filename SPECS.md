# Site de Casamento Agnes & Sammy — Plano + Specs

## Context

Casamento (jantar após civil) em **07/11/2026, sábado, 19h** — Restaurante Fazenda, Itatiba/SP. Hoje é 30/10/2026; sem pressa, site serve também pós-festa. Prazo de RSVP do convite (25/10) já passou, então RSVP fica configurável e de baixa prioridade.

Objetivo: site onde noivos montam **lista de presentes** e convidados **reservam presente + pagam Pix manual**. Extras: RSVP, página do evento, mural de recados, galeria de fotos. Repo vazio (`C:\Users\lucas\Projetos\casamento-agnes-sammy`, git sem commits) → projeto do zero.

Ao aprovar: copiar este arquivo para `SPECS.md` na raiz do repo (+ `CLAUDE.md` curto apontando para ele) e começar pela Fase 0.

## Pesquisa de mercado (inspirações)

Fontes: [Zola – group gifting](https://www.zola.com/wedding-registry/benefits/group-wedding-gifting), [Zola – como funciona](https://www.zola.com/faq/115002835012), [Casamentos.com.br – lista online](https://www.casamentos.com.br/artigos/lista-online-de-casamentos--c5737), [Casamentos.com.br – Pix de casamento](https://www.casamentos.com.br/artigos/pix-de-casamento--c10086), [myBest – sites de lista](https://br.my-best.com/20640), [Workana – requisitos de cotas](https://www.workana.com/job/sistema-de-lista-de-casamento-site).

O que copiar:
- **Zola**: presente de grupo (várias pessoas pagam partes até completar), fundo em dinheiro, esconder meta do fundo, item marcado como "comprado". → nossas **cotas**.
- **Casar.com / iCasei / Casamentos.com.br**: lista virtual convertida em dinheiro com saque por Pix, cotas de lua de mel/experiências, faixas de valor (≈ R$100 / 300 / 600+), filtros por categoria. 74% dos casais preferem dinheiro (dado da própria Casar.com).
- Boa prática BR: Pix visível no site e na lista, **não** impresso no convite. Plataformas cobram taxa → nosso site tem **zero taxa** (Pix direto na chave dos noivos).
- Não copiar: loja integrada/estoque/frete (fora de escopo).

## Identidade visual (do convite)

Tokens (aproximados do convite; ajustar com amostrador na Fase 2):

| Token | Hex | Uso |
|---|---|---|
| `paper` | `#F6F1EA` | fundo geral (textura papel kraft clara) |
| `paper-dark` | `#E6DCD0` | faixas/blocos "papel rasgado" |
| `rose` | `#D14D80` | monograma, datas, CTA, "Save the Date" |
| `wine` | `#5B1A2E` | texto principal, títulos |
| `crimson` | `#A3204A` | rodapé, hover, ênfase |
| `blush` | `#EBDDE2` | pílulas/avisos (ex.: "Confirme presença") |
| `fuchsia` | `#C2185B` | flores, detalhes |
| `gold` | `#B8997A` | folhas glitter, divisórias finas |

Tipografia (Google Fonts via `next/font`): títulos/nomes **Cormorant Garamond** (itálico nos nomes); script **Allura** ("Save the Date"); destaque tipo "Sábado/19h" **Playfair Display**; corpo Cormorant com `letter-spacing` aberto como no convite.

Logo/arte: **recortar direto do convite** (`...\scratchpad`-sibling `images\1.png`, 900×1600) na Fase 2, via script one-off (Python Pillow ou `sharp`, fora do app) → PNG com fundo transparente em `public/brand/`: `monogram.png` (A/S entrelaçado), `save-the-date.png` (script rosa), `flowers-top-left/top-right/bottom-left/bottom-right.png`, `paper-strip.png` (faixa rasgada). Fundo creme removido por chroma-key/threshold; monograma também vetorizado em SVG se qualidade do recorte não bastar. Se resolução baixa, pedir convite original em maior resolução. Detalhes: coração entre números da data, linhas finas com coração central, pílula arredondada blush, rodapé crimson com "com carinho, Agnes e Sammy". Tailwind + shadcn/ui com tokens acima em `globals.css`. Mobile-first (convite é formato story).

## Stack

Next.js (App Router) + TypeScript strict · Drizzle ORM + Neon Postgres · Auth.js (NextAuth v5, estratégia **JWT**) · Server Actions · Zod · Tailwind + shadcn/ui · Cloudinary (upload assinado) · Vitest (prioridade: integração) · deploy Vercel.

- **Neon + transações**: usar `drizzle-orm/neon-serverless` (Pool WebSocket) em produção — driver HTTP não suporta transação. Repositories tipam o banco como `PgDatabase` → testes usam `node-postgres` com mesma API.
- **Auth**: provider Google (admin/noivos, **allowlist** pela tabela `users`: e-mail não cadastrado ou inativo = negado) + provider Credentials `guest-code` (convidado). JWT carrega `{ id, role, guestId? }`. Sem adapter/tabelas de sessão.
- **Roles**: `admin` (Lucas), `couple` (Agnes, Sammy), `guest` (por código).

## Regras de código (obrigatórias)

1. **Máx. 150 linhas por arquivo.** Estourou → dividir.
2. **SRP**: 1 arquivo = 1 responsabilidade; 1 use-case por arquivo, 1 função pública por use-case.
3. **DIP**: use-case depende de **interface** de repository, recebida por parâmetro (factory). Só `factory.ts` do módulo conhece a implementação Drizzle. Use-case nunca importa `db`, `next/*`, `auth`.
4. **Nomes simples e explícitos**: `reserveGift`, `confirmPixPayment`, `listGiftsPage`, `isGiftAvailable`. Proibido `data`, `info`, `handle`, `process`, `util`, abreviações.
5. Sem comentários; nome explica. Sem `any`. Sem `import * as React` (usar `import { useState } from 'react'` e `import type { ... }`).
6. Server Action = **controller** fino: valida (Zod) → checa permissão → chama use-case → `revalidatePath` → retorna `{ ok, error }`. Sem regra de negócio.
7. **Paginação sempre no backend** (`limit/offset` no repository, `count` separado). Estado de listagem **só na URL** (`searchParams`), página é Server Component que lê params, valida e consulta.
8. Valores monetários em **centavos (integer)**. Datas em UTC, exibir `America/Sao_Paulo`.
9. Erros de negócio via classes (`GiftUnavailableError`…) mapeadas no controller → mensagem pt-BR.
10. Autorização checada no controller **e** no use-case sensível (nunca só no UI/proxy).
11. Commits: um commit por tarefa concluída; mensagens claras, semânticas (Conventional Commits: feat, fix, refactor, chore, docs, test, style) e **em inglês**; pequenos (1 a 4 arquivos), `git add <caminhos exatos>`; **sem** `Co-Authored-By`/atribuição ao Claude.

## Estrutura de pastas (por domínio)

```
src/
  app/                              rotas finas: só compõem controller + components
    (public)/page.tsx               evento (home)
    (public)/entrar/page.tsx        login convidado (?codigo=)
    (public)/admin/entrar/page.tsx  login Google
    (guest)/presentes/              lista paginada + [giftId]
    (guest)/meus-presentes/
    (guest)/confirmar-presenca/
    (guest)/recados/  (guest)/galeria/
    (panel)/painel/                 admin + noivos
      convidados/ presentes/ pagamentos/ recados/ fotos/ usuarios/ evento/
    api/auth/[...nextauth]/route.ts
    api/cron/expire-reservations/route.ts
  modules/
    auth/        config/ use-cases/ controllers/ types.ts factory.ts
    users/       controllers/ use-cases/ repositories/ schemas/ schema.ts factory.ts
    guests/      (código de acesso, vagas, link WhatsApp)
    gifts/       (catálogo, categorias, modos single|fixed_quotas|free_amount)
    contributions/ (reservar, cancelar, expirar, confirmar Pix)
    payments/    lib/pix-brcode.ts (Pix copia-e-cola + QR estático)
    rsvp/ event/ messages/ gallery/
    # cada módulo:
    #   controllers/   *.actions.ts ('use server') e *.queries.ts (leitura p/ páginas)
    #   use-cases/     reserve-gift.ts, confirm-pix-payment.ts ...
    #   repositories/  gift-repository.ts (interface) + drizzle-gift-repository.ts
    #   schemas/       zod (entrada)    schema.ts = tabelas Drizzle
    #   components/    UI do domínio     lib/ helpers puros do domínio
    #   errors.ts  types.ts  factory.ts (composition root)
  shared/
    db/          client.ts (neon-serverless)  schema.ts (reexporta tabelas)  migrations/
    lib/         pagination.ts  url-params.ts  money.ts  dates.ts  result.ts  cloudinary.ts
    config/      env.ts (Zod valida process.env)
    ui/          shadcn/ui    components/  layout, pagination-controls, empty-state
    lib/cache/   cache-tags.ts  cached-read.ts  invalidate.ts (interface + impl Next)
    theme/       tokens e fontes
  tests/
    integration/ por módulo (banco real)   helpers/ (reset db, seeds, fake session)
```

## Cache e invalidação

Princípio: **leitura cacheada por tag, escrita invalida a tag**. Tudo isolado em `shared/lib/cache/` (`cache-tags.ts` + `cached-read.ts`) para o resto do código não conhecer a API do Next (DIP; usa `unstable_cache`/`use cache` conforme versão instalada, `revalidateTag`/`updateTag`/`revalidatePath`).

- **Tags por domínio** (função pura, nome claro): `eventTag`, `giftsTag`, `giftTag(id)`, `categoriesTag`, `approvedMessagesTag`, `approvedPhotosTag`, `guestTag(id)`, `contributionsTag(guestId)`, `pendingPaymentsTag`.
- **Cacheado** (chave inclui `page/perPage/search/category/status/sort`): home/evento, catálogo de presentes (campos estáticos), categorias, recados e fotos **aprovados**, contagens do painel.
- **Nunca cacheado**: sessão/auth, `meus-presentes` (ou só com tag por convidado), tela de pagamento, rate limit, disponibilidade em tempo real (calculada na query com `expiresAt > now()`; reserva expirada não pode "prender" cache).
- **Invalidação**: todo controller de escrita chama `invalidate…` ao final, via use-case → retorna quais tags mudaram:
  - editar evento/Pix → `eventTag`; CRUD presente/categoria → `giftsTag`, `giftTag(id)`, `categoriesTag`.
  - reservar/cancelar/confirmar/expirar contribuição → `giftsTag`, `giftTag(id)`, `contributionsTag(guestId)`, `pendingPaymentsTag`.
  - aprovar/rejeitar recado/foto → `approvedMessagesTag` / `approvedPhotosTag`; RSVP → `guestTag(id)`.
  - cron `expire-reservations` invalida `giftsTag` + `pendingPaymentsTag` se expirou algo.
- Rotas `(panel)` e `(guest)` autenticadas = dinâmicas; só o **dado** compartilhado é cacheado, nunca resposta por usuário. Imagens: Cloudinary CDN + `next/image`, `public_id` versionado ao trocar foto.
- **Testes de integração de cache**: mutação → leitura seguinte reflete mudança (sem TTL de espera); tags certas disparadas por cada controller (invalidador injetado como interface, fake nos testes captura as tags chamadas).

## Modelo de dados (Drizzle / Neon)

- `users`: id, name, email (unique), image, role (`admin|couple`), isActive, createdAt.
- `guests`: id, code (unique, 8 chars sem ambíguos `0O1IL`, ex. `K7M2QX9P`), name, phone?, seats (vagas do grupo), createdBy, lastAccessAt.
- `rsvps`: guestId (unique), status (`pending|going|declined`), respondedAt.  `rsvp_companions`: id, guestId, name, dietaryNote?.
- `gift_categories`: id, name, order.
- `gifts`: id, categoryId, kind (`item|experience`), name, description, imageUrl (Cloudinary), priceCents, mode (`single|fixed_quotas|free_amount`), totalQuotas?, minAmountCents?, isVisible, order, createdAt.
- `gift_contributions`: id, giftId, guestId, quotas?, amountCents, status (`reserved|confirmed|cancelled|expired`), expiresAt (reserva +48h), confirmedAt?, confirmedBy?, createdAt.
- `messages`: id, guestId, authorName, body, status (`pending|approved|rejected`), contributionId?, createdAt.
- `photos`: id, cloudinaryPublicId, url, caption?, uploadedByUserId?, uploadedByGuestId?, status (`pending|approved|rejected`), createdAt.
- `event_settings` (1 linha): coupleNames, eventAt, venueName, address, mapUrl, story, rsvpDeadline, pixKey, pixKeyType, pixReceiverName, pixCity.
- `login_attempts`: ipHash, at (rate limit de código).

Índices: `guests.code`, `gift_contributions(giftId,status)`, `gifts(categoryId,isVisible)`.

## Regras de negócio

**Presentes**
- `single`: 1 convidado pega o item inteiro. `fixed_quotas`: item = N cotas de `price/N`, convidado pega 1+ cotas. `free_amount`: convidado digita valor ≥ `minAmountCents` até completar total.
- Disponível = total − (`confirmed` + `reserved` não expirado). Calculado **na consulta** (lazy); cron diário só marca `expired` para limpar.
- Reservar roda em **transação** com `SELECT … FOR UPDATE` no gift → sem estouro de cota em concorrência.
- Convidado vê só estado ("disponível / X de N cotas / completo"), **não** nomes de outros doadores. Noivos veem tudo. Convidado pode cancelar a própria reserva enquanto `reserved`.
- Fluxo: reservar → tela com valor + chave Pix + copia-e-cola + QR → convidado paga fora → noivos veem em `/painel/pagamentos` e **confirmam** → `confirmed` (+ recado opcional no mural). Sem confirmar em 48h → `expired`, item volta.
- Item com contribuição `confirmed` não pode ser excluído (só ocultado).

**Convidados / acesso**
- Noivos/admin cadastram convidado → sistema gera código → botão "enviar por WhatsApp" com link `/entrar?codigo=XXXX`.
- Código inválido: erro genérico; rate limit (ex. 10 tentativas/15 min por IP) em `login_attempts`.
- Convidado só acessa rotas `(guest)`; noivos `(panel)` exceto `usuarios`; admin tudo. Gate no proxy/middleware **e** nos controllers.

**RSVP**: código = grupo com `seats` vagas; convidado confirma, informa nomes dos acompanhantes (≤ seats−1) e restrição alimentar. Respeita `rsvpDeadline` (editável; hoje 25/10 já passou → noivos podem estender). Painel mostra totais.

**Mural/Galeria**: convidado envia recado/foto → `pending` → noivos aprovam → público (convidados logados) vê só `approved`. Upload Cloudinary **assinado** (assinatura gerada por server action; tipo/tamanho validados, máx. ~8 MB, resize no delivery).

**Listagens (todas)**: URL `?page=1&perPage=12&search=&category=&status=&sort=`; `perPage` ∈ {12,24,48} (default 12); params inválidos caem no default (Zod `.catch`). `shared/lib/pagination.ts` expõe `parsePageParams`, `buildPageResult({items,total,page,perPage})`; componente `PaginationControls` monta links preservando filtros.

**Segurança/LGPD**: dados mínimos (nome, telefone opcional); sem indexação (`robots noindex`) por ser site privado; CSRF nativo de Server Actions; headers de segurança; `env.ts` falha no boot se faltar variável.

## Fases (cada fase fecha com testes verdes + commit)

0. **Setup**: `create-next-app` (TS, Tailwind, App Router, src/), shadcn init, drizzle-kit, Vitest, ESLint com regra `max-lines: 150`, `.env.example`, CI simples (lint+tsc+test), `SPECS.md`/`CLAUDE.md`.
1. **Fundação**: `shared/db`, schema users, Auth.js (Google + guest-code), roles, proxy de rotas, `shared/lib` (pagination, money, errors, result, **cache tags + invalidate**), seed do admin.
2. **Tema + Evento**: tokens, fontes, recorte do logo/flores do convite → `public/brand/`, layout, home com dados do convite, `event_settings` editável no painel.
3. **Usuários + Convidados**: CRUD admin/noivos, convidados com código, link WhatsApp, listagem paginada.
4. **Presentes (catálogo)**: categorias, CRUD gifts (3 modos), upload Cloudinary, lista pública paginada com filtros.
5. **Contribuições + Pix**: reservar (transação), tela de pagamento (copia-e-cola/QR), `meus-presentes`, painel de pagamentos, confirmar/cancelar, cron de expiração.
6. **RSVP**. 7. **Mural**. 8. **Galeria** (com moderação).
9. **Acabamento**: a11y, SEO/OG (imagem com monograma), estados vazios/erro, Lighthouse, deploy Vercel + Neon (branch `main` e branch de teste), domínio.

## Testes (Vitest — integração primeiro)

- Banco **real**: Postgres de teste (Neon branch `test` ou Docker local), migrações aplicadas no `globalSetup`, `TRUNCATE` entre testes. Repositories reais, sem mock de DB.
- Prioridade: use-cases/controllers cobrindo fluxo completo — reservar sob concorrência (`Promise.all` não passa do total), expiração, confirmação, permissões por role, código inválido/rate limit, paginação + filtros por URL params, RSVP com limite de vagas, moderação.
- Unit só para lógica pura (`pix-brcode`, `money`, `parsePageParams`, cálculo de cotas).
- Sessão fake via helper `asUser(role)`; Cloudinary e Google atrás de interface (DIP) com fake nos testes.

## Verificação end-to-end (ao final de cada fase)

`pnpm lint && pnpm tsc --noEmit && pnpm test`; `pnpm dev` + navegação real (Playwright/Chrome): login Google (noivos) → criar presente 3 cotas → criar convidado → entrar por código → reservar cota → ver Pix → noivos confirmam → progresso do item atualiza → listagem pagina por `?page=2`. Checar `wc -l` ≤ 150 em todos os arquivos (script no CI).

## Pendências para decidir/fornecer

- (resolvido) Arte recortada do PNG do convite; só pedir original maior se a resolução ficar ruim.
- Chave Pix, tipo, nome do recebedor e cidade; texto "nossa história"; fotos do casal.
- E-mails Google do admin e dos noivos; domínio do site (ex. `agnesesammy.com.br`).
- Credenciais: Neon, Cloudinary, Google OAuth (Cloud Console), projeto Vercel.
- Confirmar: RSVP ainda desejado (prazo passou)? Categorias iniciais de presentes (casa, cozinha, lua de mel…)?
- Defaults assumidos (mudar se discordar): convidado não vê nome de outros doadores; reserva expira 48h; 12 itens por página; site privado `noindex`.
