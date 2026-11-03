# Agnes & Sammy — Site de Casamento

Site do casamento de **Agnes & Sammy**: jantar após o civil em **07/11/2026 (sábado), 19h**, no Restaurante Fazenda, Itatiba/SP.

Os noivos montam uma **lista de presentes**, os convidados **reservam um presente e pagam por Pix direto na conta do casal** (zero taxa, sem intermediário) e os noivos confirmam cada pagamento num painel. Além disso, o site tem página do evento, confirmação de presença (RSVP), mural de recados e galeria de fotos, tudo com moderação dos noivos.

O visual segue o convite: papel kraft, flores em aquarela, monograma A/S, tons de rosa e vinho, fontes Cormorant Garamond, Allura e Playfair Display.

<p align="center">
  <img src="docs/screenshots/01-login-desktop.webp" alt="Tela de entrada do site" width="720">
</p>

## Sumário

- [O que o site faz](#o-que-o-site-faz)
- [Tour pelas telas](#tour-pelas-telas)
- [Tour guiado dos noivos](#tour-guiado-dos-noivos)
- [Stack](#stack)
- [Decisões técnicas](#decisões-técnicas)
- [Estrutura do projeto](#estrutura-do-projeto)
- [Como rodar localmente](#como-rodar-localmente)
- [Testes e qualidade](#testes-e-qualidade)
- [CI/CD e deploy](#cicd-e-deploy)
- [Estado atual do projeto](#estado-atual-do-projeto)
- [Documentação complementar](#documentação-complementar)

## O que o site faz

Existem três papéis de acesso:

| Papel | Como entra | O que pode fazer |
| --- | --- | --- |
| `guest` (convidado) | Código de acesso de 8 caracteres do convite | Ver o evento, escolher e pagar presentes, confirmar presença, deixar recados, enviar fotos, editar o próprio perfil |
| `couple` (noivos) | Login com Google (lista de e-mails autorizados) | Tudo do painel: convidados, presentes, pagamentos, presenças, moderação, evento e Pix |
| `admin` | Login com Google | Tudo dos noivos, mais o cadastro de usuários do painel |

Principais fluxos:

- **Lista de presentes** com três modos: item único, cotas fixas (várias pessoas dividem um presente maior) e valor livre. Cada presente pode ter foto, link da loja e preço conferido.
- **Reserva e Pix**: o convidado reserva, vê o valor, a chave, o Pix copia-e-cola e um QR Code. Paga fora do site. Os noivos conferem no app do banco e confirmam. Sem confirmação em 48 horas, a reserva expira e a cota volta para a lista.
- **Convidados** com código único, link de convite e botão de WhatsApp.
- **RSVP** por grupo, com acompanhantes (limitado às vagas do convite) e restrição alimentar.
- **Mural de recados** e **galeria de fotos**, só aparecem depois de aprovados.
- **Sugestões de presentes** para os noivos: catálogo com produtos reais verificados, que entram na lista com um clique.
- **Tour guiado** no primeiro acesso dos noivos ao painel.

## Tour pelas telas

Todas as telas são mobile-first e foram revisadas em 360px, 768px e 1280px. Os prints abaixo foram tirados do app rodando localmente com dados de exemplo.

### Entrada

Convidados entram com o código do convite (que pode vir preenchido pelo link). Os noivos usam a aba "Somos os noivos", com login Google.

| Convidado (desktop) | Noivos | Mobile |
| --- | --- | --- |
| <img src="docs/screenshots/01-login-desktop.webp" width="320" alt="Login do convidado"> | <img src="docs/screenshots/14-login-noivos.webp" width="320" alt="Login dos noivos"> | <img src="docs/screenshots/02-login-mobile.webp" width="160" alt="Login no celular"> |

### Área do convidado

**Início, convite e página do casamento.** O início tem contagem regressiva e um resumo da presença e dos presentes. A página do casamento traz data, local, mapa e a história do casal.

| Início | Convite | O casamento |
| --- | --- | --- |
| <img src="docs/screenshots/03-guest-inicio.webp" width="320" alt="Início do convidado"> | <img src="docs/screenshots/08-guest-convite.webp" width="320" alt="Convite pessoal"> | <img src="docs/screenshots/09-guest-casamento.webp" width="320" alt="Página do casamento"> |

**Lista de presentes.** Busca, preço mínimo e máximo, ordenação e paginação no backend, com o estado na URL. A disponibilidade é calculada na consulta, em tempo real.

| Lista (desktop) | Lista (mobile) |
| --- | --- |
| <img src="docs/screenshots/04-guest-presentes.webp" width="480" alt="Lista de presentes"> | <img src="docs/screenshots/13-guest-presentes-mobile.webp" width="200" alt="Lista de presentes no celular"> |

**Reserva e pagamento por Pix.** O convidado escolhe quantas cotas quer e se aparece no mural de recados. Ao reservar, recebe o QR Code, a chave e o código Pix copia-e-cola, gerado no padrão BR Code com CRC16. Ele pode editar ou cancelar a própria reserva enquanto ela estiver aguardando pagamento.

| Detalhe do presente | Pix | Meus presentes |
| --- | --- | --- |
| <img src="docs/screenshots/05-guest-presente-detalhe.webp" width="320" alt="Detalhe do presente"> | <img src="docs/screenshots/06-guest-pix.webp" width="320" alt="Tela de pagamento com Pix"> | <img src="docs/screenshots/07-guest-meus-presentes.webp" width="320" alt="Meus presentes"> |

**Presença, recados e galeria.**

| Confirmar presença | Mural de recados | Galeria |
| --- | --- | --- |
| <img src="docs/screenshots/10-guest-rsvp.webp" width="320" alt="Confirmação de presença"> | <img src="docs/screenshots/11-guest-recados.webp" width="320" alt="Mural de recados"> | <img src="docs/screenshots/12-guest-galeria.webp" width="320" alt="Galeria de fotos"> |

### Painel dos noivos

**Início do painel.** Passo a passo de configuração (Pix, história, fotos, presentes) e totais de reservas, pagamentos pendentes, presenças e moderação.

<p align="center">
  <img src="docs/screenshots/16-painel-inicio.webp" alt="Início do painel dos noivos" width="720">
</p>

**Pagamentos e presentes.** Os noivos confirmam, rejeitam ou excluem cada reserva. A confirmação é atômica e nunca estoura o número de cotas. No catálogo, cada item mostra categoria, loja, preço conferido e o andamento das cotas.

| Pagamentos | Presentes |
| --- | --- |
| <img src="docs/screenshots/17-painel-pagamentos.webp" width="480" alt="Painel de pagamentos"> | <img src="docs/screenshots/18-painel-presentes.webp" width="480" alt="Painel de presentes"> |

**Sugestões de presentes.** Catálogo de 289 sugestões em 6 categorias, com busca, filtros, seleção múltipla e adição à lista sem duplicar itens.

<p align="center">
  <img src="docs/screenshots/19-painel-sugestoes.webp" alt="Sugestões de presentes" width="720">
</p>

**Convidados, presenças, recados, fotos e evento.**

| Convidados | Presenças | Recados |
| --- | --- | --- |
| <img src="docs/screenshots/20-painel-convidados.webp" width="320" alt="Painel de convidados"> | <img src="docs/screenshots/21-painel-presencas.webp" width="320" alt="Painel de presenças"> | <img src="docs/screenshots/22-painel-recados.webp" width="320" alt="Moderação de recados"> |

| Fotos | Evento e Pix | Painel no celular |
| --- | --- | --- |
| <img src="docs/screenshots/24-painel-fotos.webp" width="320" alt="Moderação de fotos"> | <img src="docs/screenshots/23-painel-evento.webp" width="320" alt="Evento e Pix"> | <img src="docs/screenshots/25-painel-mobile.webp" width="160" alt="Painel no celular"> |

> A chave Pix dos prints é a chave de exemplo `123e4567-e89b-12d3-a456-426614174000`. Nenhum dado real aparece nas imagens.

## Tour guiado dos noivos

No primeiro acesso ao painel, os noivos veem um tour de 10 passos. Cada passo traz uma simulação interativa da tela real (por exemplo, tocar nas cotas de um presente para ver o que o convidado enxerga) e um botão que leva direto à tela correspondente. O último passo é uma checklist do que ainda falta configurar. O tour pode ser pulado e revisto a qualquer momento pelo botão "Rever tour". A conclusão fica salva em `users.tour_completed_at`.

| # | Passo |
| --- | --- |
| 1 | Boas-vindas ao site |
| 2 | Primeiro, os dados da festa |
| 3 | A lista de presentes, do jeito de vocês |
| 4 | Cada convidado ganha um código |
| 5 | Como o convidado entra e se apresenta |
| 6 | Como tudo aparece para ele |
| 7 | Pagamentos: confirmar o Pix |
| 8 | Quem vem à festa |
| 9 | Recados e fotos com o seu aval |
| 10 | Agora é com vocês (checklist final) |

| Passo 1 | Passo 3 | Passo 4 |
| --- | --- | --- |
| <img src="docs/screenshots/15-tour-01.webp" width="320" alt="Tour passo 1"> | <img src="docs/screenshots/15-tour-03.webp" width="320" alt="Tour passo 3"> | <img src="docs/screenshots/15-tour-04.webp" width="320" alt="Tour passo 4"> |

| Passo 5 | Passo 6 | Passo 7 |
| --- | --- | --- |
| <img src="docs/screenshots/15-tour-05.webp" width="320" alt="Tour passo 5"> | <img src="docs/screenshots/15-tour-06.webp" width="320" alt="Tour passo 6"> | <img src="docs/screenshots/15-tour-07.webp" width="320" alt="Tour passo 7"> |

| Passo 8 | Passo 9 | Passo 10 |
| --- | --- | --- |
| <img src="docs/screenshots/15-tour-08.webp" width="320" alt="Tour passo 8"> | <img src="docs/screenshots/15-tour-09.webp" width="320" alt="Tour passo 9"> | <img src="docs/screenshots/15-tour-10.webp" width="320" alt="Tour passo 10"> |

O tour também funciona no celular:

<p align="center">
  <img src="docs/screenshots/26-tour-mobile.webp" alt="Tour no celular" width="240">
</p>

## Stack

| Camada | Tecnologia |
| --- | --- |
| Framework | Next.js 16 (App Router) e React 19, TypeScript estrito |
| Banco | PostgreSQL, Drizzle ORM. Neon em produção, Postgres 17 em Docker no desenvolvimento |
| Autenticação | Auth.js v5 (NextAuth), estratégia JWT: Google para os noivos e provider de credenciais para o código do convidado |
| Validação | Zod 4 |
| Estilo | Tailwind CSS 4, shadcn/ui sobre Base UI, tokens do convite em `globals.css` |
| Imagens | Cloudinary (upload assinado) e `next/image` |
| Pix | BR Code com CRC16 e QR Code gerados no servidor (`qrcode`) |
| Testes | Vitest 5, com PGlite (Postgres em memória) para os testes de integração |
| Deploy | Vercel (app e cron), GitHub Actions (CI e migrations), pnpm |

## Decisões técnicas

### Pix manual em vez de gateway de pagamento

Plataformas de lista de presentes cobram taxa e prendem o dinheiro. Aqui o Pix cai direto na conta do casal e o site só **organiza** a reserva. O site gera o BR Code estático (chave, valor, nome e cidade, com CRC16) e os noivos confirmam o recebimento no painel. Isso elimina taxa, conciliação automática e risco de custódia. A contrapartida é a confirmação humana, tratada com o prazo de 48 horas para a reserva expirar.

### Disponibilidade calculada na consulta, expiração preguiçosa

Disponível = total menos (confirmadas + reservadas ainda válidas). O cálculo usa `expiresAt > now()` na própria query, então uma reserva vencida nunca "prende" um presente, mesmo que o cron ainda não tenha rodado. O cron diário (`/api/cron/expire-reservations`, protegido por `CRON_SECRET`) só marca as vencidas como `expired` para limpar o banco e invalidar o cache.

### Concorrência: reservar e confirmar em transação com lock

Reservar roda em transação com `SELECT … FOR UPDATE` na linha do presente, e a confirmação de pagamento também é atômica. Dois convidados disputando a última cota não conseguem estourar o total. Isso é coberto por testes de concorrência com `Promise.all`.

### Arquitetura em camadas por módulo (DIP)

Cada domínio vive em `src/modules/<nome>` com a mesma forma:

```
controllers/   actions/ (Server Actions, 'use server')  queries/  handlers/
use-cases/     um por arquivo, regra de negócio pura
repositories/  contracts/ (interfaces)  drizzle/ (implementações)
schemas/       Zod de entrada
components/    UI do módulo, separada por finalidade
lib/           helpers puros por tema
factory.ts     composição, o único arquivo que conhece o Drizzle
```

- O **controller** é fino: valida com Zod, pega o usuário da sessão, chama o use-case, invalida o cache e devolve um `ActionResult`.
- O **use-case** recebe interfaces de repositório e o `actor` (usuário da sessão), chama `requireRole` e nunca importa banco, `next/*` ou a configuração de auth. O ESLint impõe essas fronteiras.
- A autorização é checada no controller **e** no use-case, nunca só na UI ou no proxy.
- Trocar o banco ou testar sem Next.js exige mexer apenas no `factory.ts`.

### Regras de código automatizadas

O repositório impõe, via ESLint e um script de CI (`scripts/check-file-lines.mjs`): **máximo de 150 linhas por arquivo**, sem `any`, sem comentários (o nome explica), sem `import * as React`, sem `window.confirm/alert/prompt` (existe um modal próprio para ações destrutivas). Valores monetários são sempre **inteiros em centavos**, datas ficam em UTC e são exibidas em `America/Sao_Paulo`.

### Cache por tags

Leitura cacheada por tag, escrita invalida a tag. Tudo fica isolado em `src/shared/lib/cache`: `CachedReader` (com `unstable_cache`) e `CacheInvalidator` (com `revalidateTag`), para o restante do código não conhecer a API do Next. Entram no cache apenas dados compartilhados (evento, catálogo, categorias, recados e fotos aprovados). Sessão, "meus presentes", tela de pagamento, rate limit e disponibilidade em tempo real nunca são cacheados. Os testes injetam um `FakeCacheInvalidator` e verificam quais tags cada controller dispara.

### Listagens com estado na URL e paginação no backend

Toda listagem lê `?page`, `perPage`, `q`, filtros e `sort` dos `searchParams` numa página Server Component. Parâmetros inválidos caem no padrão (Zod `.catch`). O repositório faz `limit/offset` e o `count` separado. Resultado: links compartilháveis, botão voltar correto e nenhuma lista inteira no cliente.

### Segurança e privacidade

- **Login por código com rate limit** atômico (janela de 15 minutos por IP, guardando só o hash) e erro genérico para código inválido.
- A **sessão é revalidada no banco**: desativar um usuário ou apagar um convidado derruba o acesso mesmo com o JWT ainda válido.
- Os e-mails dos noivos e do admin entram numa **allowlist** na tabela `users`. E-mail não cadastrado ou inativo é negado no login Google.
- O código de acesso é removido da URL depois de lido e `/` e `/entrar` usam `Referrer-Policy: no-referrer`.
- Headers de segurança: CSP restrita ao próprio site e ao Cloudinary, `X-Frame-Options: DENY`, `nosniff`, `Permissions-Policy` e `X-Robots-Tag: noindex, nofollow` (o site é privado).
- Uploads assinados pelo servidor, com limite de **8 MB** validado também no upload preset do Cloudinary, e URLs de imagem e de produto validadas (sem credenciais ou portas explícitas, só hosts permitidos).
- As variáveis de ambiente são validadas com Zod, por módulo, e as falhas aparecem na subida. Segredos ficam só no `.env`, nunca no repositório.
- O mural e a galeria só exibem o que os noivos aprovaram. O convidado vê apenas o estado de cada presente (disponível, "X de N cotas", completo), nunca o nome de outros doadores, e pode escolher aparecer como anônimo no recado.

### Catálogo de sugestões verificado

O módulo `gift-suggestions` tem um catálogo estático gerado por `pnpm suggestions:import` a partir de pesquisas em JSON. O importador é determinístico, valida cada produto (loja permitida, URL https sem rastreamento, host de imagem na lista de permitidos) e só escreve os arquivos depois de renderizar tudo em memória. O comando `pnpm suggestions:check-prices` é somente leitura: reporta preços divergentes e páginas inacessíveis, inclusive bloqueios anti-bot.

### Banco e migrations

O schema é dividido por módulo (`src/modules/*/schema.ts`) e reexportado em `src/shared/db`. Migrations são geradas por `drizzle-kit` e aplicadas em produção por um workflow dedicado e idempotente. O driver muda conforme o host da `DATABASE_URL`: `pg` para o Postgres local e o driver serverless do Neon (WebSocket, que suporta transações) em produção.

### Testes de integração primeiro

A prioridade é o fluxo completo contra um banco real. O PGlite roda o Postgres dentro do processo, aplica as migrations de verdade e é truncado entre os testes. Sem mock de banco. Cloudinary e Google ficam atrás de interfaces com fakes.

## Estrutura do projeto

```
src/
  app/                  rotas finas, só compõem controllers e componentes
    (public)/           login (convidado e noivos)
    (guest)/            início, convite, presentes, recados, galeria...
    (panel)/painel/     painel dos noivos e do admin
    api/                auth e cron de expiração
  modules/              auth, users, guests, gifts, gift-suggestions,
                        contributions, payments, rsvp, event, messages,
                        gallery, dashboard, profile, tour
  shared/
    db/                 cliente, tipos, migrations
    config/             env.ts (Zod)
    lib/                cache, pagination, money, dates, errors, cloudinary...
    ui/                 primitives, dialogs, layout, forms, feedback, navigation
    seo/                metadados, imagem Open Graph, manifest
  proxy.ts              gate de rotas por papel (Next 16 usa proxy, não middleware)
  tests/                helpers (banco, seeds, fakes) e testes de integração
scripts/                migrate, seeds, importador de sugestões, checagem de preços
docs/                   CI/CD, pesquisa e importação de sugestões, prints
SPECS.md                especificação completa e regras de negócio
TASKS.md                andamento por fase
```

Os módulos usam `src/modules/users` como modelo. Pastas com mais de cerca de 8 arquivos soltos são divididas em subpastas por tópico.

## Como rodar localmente

**Pré-requisitos:** Node.js 20+, pnpm e Docker.

```bash
pnpm install
cp .env.example .env
```

Preencha o `.env` (todas as credenciais, inclusive as do Postgres do Docker, ficam só nele):

| Variável | Para que serve |
| --- | --- |
| `POSTGRES_USER`, `POSTGRES_PASSWORD`, `POSTGRES_DB`, `POSTGRES_PORT` | Postgres do Docker |
| `DATABASE_URL` | Conexão do app (local ou Neon) |
| `AUTH_SECRET` | Segredo do Auth.js (`openssl rand -base64 32`) |
| `AUTH_GOOGLE_ID`, `AUTH_GOOGLE_SECRET` | Login Google dos noivos |
| `CLOUDINARY_CLOUD_NAME`, `CLOUDINARY_API_KEY`, `CLOUDINARY_API_SECRET`, `CLOUDINARY_UPLOAD_PRESET` | Upload de fotos |
| `CRON_SECRET` | Protege a rota do cron de expiração |
| `APP_URL` | URL pública do site |
| `ADMIN_EMAIL`, `ADMIN_NAME` | Primeiro administrador |

Depois:

```bash
docker compose up -d --wait
pnpm db:migrate
pnpm db:seed-admin
pnpm db:seed-categories
pnpm dev
```

Abra `http://localhost:3000`. Os noivos entram pela aba "Somos os noivos" (o e-mail precisa estar cadastrado). Para o convidado, cadastre-o em `/painel/convidados` e use o código gerado ou o link de convite.

| Comando | O que faz |
| --- | --- |
| `pnpm dev` / `pnpm build` / `pnpm start` | Desenvolvimento, build e servidor de produção |
| `pnpm lint` | ESLint e verificação do limite de 150 linhas por arquivo |
| `pnpm typecheck` | `tsc --noEmit` |
| `pnpm test` | Testes unitários e de integração |
| `pnpm db:generate` | Gera migration depois de mudar um `schema.ts` |
| `pnpm db:migrate` | Aplica migrations |
| `pnpm db:studio` | Drizzle Studio |
| `pnpm suggestions:import` | Regenera o catálogo de sugestões |
| `pnpm suggestions:check-prices` | Relatório de preços divergentes |

## Testes e qualidade

- **146 arquivos de teste, 825 testes passando** na última execução.
- Testes de integração em `src/tests/integration/<módulo>`, agrupados por tema. Cobrem reserva sob concorrência, expiração, confirmação, permissões por papel, código inválido e rate limit, paginação com filtros, RSVP com limite de vagas, moderação e invalidação de cache.
- Testes unitários ficam em uma pasta `tests/` ao lado do código que cobrem (por exemplo `payments/lib/tests/pix-brcode.test.ts`). Arquivos de produção não misturam testes.
- A cobertura inclui a lógica pura de Pix (BR Code, CRC16, normalização de chave), dinheiro, paginação e cálculo de cotas.
- Passe de acessibilidade e Lighthouse, tratamento global de erros e teste de ponta a ponta no navegador (código, reserva, Pix, confirmação e progresso do presente) registrados em `TASKS.md`.

## CI/CD e deploy

- **CI** (`.github/workflows/ci.yml`), em todo pull request e push na `main`: `pnpm lint`, `pnpm tsc --noEmit`, `pnpm test` e `pnpm build` (com valores falsos, sem segredos reais), mais um job que falha se o schema mudou e a migration não foi commitada.
- **Migrate production** (`.github/workflows/migrate-production.yml`): roda quando o CI passa na `main` e só se algo em migrations mudou. Usa o environment `production` (com aprovação opcional), nunca roda em paralelo e só aplica migrations pendentes, sem `--force` nem `drop`.
- **App** na Vercel, com cron diário às 06:00 UTC para expirar reservas. O GitHub Actions não faz o deploy do app.

Detalhes, segredos e checklist de produção em [`docs/ci-cd.md`](docs/ci-cd.md).

## Estado atual do projeto

Concluído, conforme `TASKS.md`:

- Fases 0 a 8: setup, fundação, tema e evento, usuários e convidados, catálogo de presentes, contribuições com Pix, RSVP, mural de recados e galeria.
- Telas extras, acabamento, acessibilidade, SEO e imagem de compartilhamento, tratamento de erros, tour guiado e onboarding dos noivos.
- Revisões de código, de segurança e de design (responsividade e fidelidade ao convite) com as correções aplicadas.
- Banco de produção migrado, com admin e categorias criados.

Pendente:

- **Deploy em produção** na Vercel e domínio, que dependem de configuração manual (checklist em `docs/ci-cd.md`).
- Credenciais de produção do Cloudinary e do Google OAuth e as variáveis na Vercel.
- Cadastrar no banco os e-mails Google do admin e dos noivos.
- Rodar o importador de sugestões de novo e conferir os preços com `pnpm suggestions:check-prices`.

## Documentação complementar

- [`SPECS.md`](SPECS.md): especificação completa, modelo de dados e regras de negócio
- [`TASKS.md`](TASKS.md): andamento por fase e decisões respondidas
- [`docs/ci-cd.md`](docs/ci-cd.md): pipelines, segredos e checklist de produção
- [`docs/gift-suggestions-research.md`](docs/gift-suggestions-research.md): pesquisa de lojas, fontes e premissas de preço
- [`docs/gift-suggestions-import.md`](docs/gift-suggestions-import.md): como regenerar o catálogo verificado
