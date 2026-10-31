# Tasks — Site de Casamento Agnes & Sammy

`[x]` feito · `[ ]` falta. Fonte das regras: `SPECS.md`.

## Fase 0 — Setup
- [x] Next.js 16 (App Router, TS, Tailwind, src/) e shadcn
- [x] Drizzle + drizzle-kit, Vitest (unit + integração com PGlite)
- [x] ESLint com `max-lines: 150` e script `check-file-lines`
- [x] `.env.example`, `SPECS.md`, `CLAUDE.md`
- [x] CI (lint, tsc, test, build, migrations em sincronia)
- [x] Postgres local em Docker com credenciais no `.env`
- [x] Migrations geradas e aplicadas (`pnpm db:migrate`)

## Fase 1 — Fundação
- [x] `shared/db` (driver local `pg` e Neon por host) e schema de todas as tabelas
- [x] `env.ts` com Zod, `shared/lib` (paginação, url-params, money, dates, result)
- [x] Cache por tags (`cache-tags`, `cached-read`, `invalidate`)
- [x] Auth.js v5 JWT: Google (allowlist) + código de convidado
- [x] Roles (admin, couple, guest), `requireRole`, proxy de rotas
- [x] Seed do admin e helpers de teste (`useTestDatabase`, seeds, `asUser`, fakes)

## Fase 2 — Tema + Evento
- [x] Tokens de cor e fontes do convite
- [x] Arte recortada do convite em `public/brand/`
- [x] Home pública no estilo do convite
- [x] Páginas de login (convidado e Google)
- [x] Home `/` vira tela de login (código do convite ou Google) com redirecionamento de sessões ativas
- [x] Layouts de painel e convidado (nav colapsável no mobile)
- [x] Evento editável no painel (Pix, endereço, prazo, história)

## Fase 3 — Usuários e Convidados
- [x] Usuários (admin): criar, ativar/desativar, listar, filtros
- [x] Convidados: CRUD, código único, link WhatsApp, listagem paginada

## Fase 4 — Presentes (catálogo)
- [x] Categorias e presentes (3 modos), upload Cloudinary assinado
- [x] Lista paginada com filtros e disponibilidade em tempo real
- [x] Painel de presentes e categorias

## Fase 5 — Contribuições + Pix
- [x] Reservar em transação com `FOR UPDATE`
- [x] Pix copia-e-cola e QR (BR Code com CRC16)
- [x] Meus presentes, cancelar/editar reserva própria
- [x] Painel de pagamentos: confirmar, cancelar, remover
- [x] Cron de expiração (`vercel.json`) e limpeza de tentativas de login
- [x] Confirmação atômica sem estourar cota

## Fase 6 — RSVP
- [x] Confirmar presença, acompanhantes, restrição alimentar, prazo
- [x] Painel de presenças (totais, filtros, editar e excluir pelos noivos)

## Fase 7 — Mural de recados
- [x] Enviar recado, moderação, listagem aprovada paginada

## Fase 8 — Galeria
- [x] Upload assinado, moderação, listagem aprovada paginada

## Telas extras
- [x] Início do convidado (contagem regressiva), convite pessoal, página do casamento
- [x] Perfil (convidado e noivos), 404, erro e carregamento

## Regras e segurança
- [x] Permissões: só admin/noivos editam e removem; convidado só o próprio carrinho e RSVP
- [x] Revisão de código completa e correções aplicadas
- [x] Sessão revalidada no banco, rate limit atômico do código
- [x] Validação de URL e dono das imagens Cloudinary
- [x] Timeouts no banco e fallback rápido da home
- [x] Headers de segurança e CSP
- [x] Segredos só no `.env`, regras de responsividade e commits no `SPECS.md`
- [x] Repositório no GitHub com push da `main`

## Em andamento
- [x] Revisão final de design (responsividade, fidelidade ao convite, acabamento) — notas 9, 8, 8 e 8,5
- [x] Segunda revisão de design (login, tour, painel, perfil, reserva, erros): rodapé do tour em linha única, fonte `font-serif` indefinida trocada pelas fontes do tema, textos de 12px elevados a 14px, fundo sem emenda, hover do botão com contraste AA — notas 9, 8,5, 8,5 e 9

## Faltam
- [x] Painel inicial com totais (reservas, pagamentos pendentes, presenças, moderação)
- [x] Campo para editar legenda de foto na galeria
- [x] Imagem de compartilhamento (OG) com monograma, metadados de SEO e `robots.txt`
- [x] Passe de acessibilidade e Lighthouse
- [x] Teste de ponta a ponta no navegador (código, reservar, Pix, confirmar, progresso)
- [x] Tratamento global de erros (global-error, wrapper de Server Actions, logger central, erros de API)
- [x] Índices únicos em photos.cloudinary_public_id e gifts.image_public_id
- [x] Passo a passo (onboarding) no painel para os noivos configurarem chave Pix, história, fotos e presentes
- [x] Seed das categorias iniciais de presentes (Cozinha & Eletrodomésticos, Sala & Decoração, Quarto & Banho, Lua de Mel & Experiências, Casa Nova / Cotas Livres, Divertidos / Zoeira)
- [x] Opção para o convidado escolher se a contribuição/recado do Pix será anônima ou não
- [x] Cadastro/edição pelo convidado ao entrar com código: nome, telefone, e-mail e familiares
- [x] Travar limite de 8 MB de upload também no Cloudinary (upload preset)
- [x] Travar modo, valor e cotas de presente que já tem contribuição ativa
- [x] Primeiro disparo real do workflow de migration em produção — secret `DATABASE_URL` criado no ambiente `production` e workflow executado com sucesso
- [ ] Deploy em produção (Vercel + Neon) e domínio — manual, ver checklist em `docs/ci-cd.md`
- [x] Build rodando em `localhost:3000` — build ok e servidor validado (porta 3100, pois a 3000 estava ocupada)
- [x] Tour guiado para noivos/admin no primeiro acesso ao painel (módulo `tour`, coluna `users.tour_completed_at`, botão "Rever tour") — a migration `0004` precisa rodar em produção pelo workflow de migration

## Dados pendentes do casal (via painel / `.env`)
- [x] Chave Pix, tipo, nome do recebedor e cidade — *preenchido pelos noivos no painel (via passo a passo)*
- [x] Texto "nossa história" e fotos do casal — *preenchido pelos noivos no painel (via passo a passo)*
- [ ] E-mails Google do admin e dos noivos, e domínio do site — falta cadastrar no banco (`ADMIN_EMAIL` + seed) e configurar o domínio
- [ ] Credenciais: Neon (feito: banco de produção migrado, admin e categorias criados, secret no GitHub), faltam Cloudinary, Google OAuth e variáveis na Vercel (ver `.env.production`)
- [x] Categorias iniciais de presentes — *definidas (6 categorias padrão)*

## Dúvidas para responder (Respondidas)
- [x] Chave Pix: tipo, nome do recebedor e cidade — **Resposta:** os noivos preencherão no painel; haverá passo a passo (onboarding) ao entrarem mostrando o que podem fazer.
- [x] Texto "nossa história" e fotos do casal — **Resposta:** os noivos preencherão no painel seguindo o passo a passo.
- [x] E-mails Google do admin e dos noivos, e o domínio do site — **Resposta:** configurados via painel/ambiente seguindo o passo a passo.
- [x] Credenciais de Neon, Cloudinary, Google OAuth e Vercel; secret `DATABASE_URL` no ambiente `production` do GitHub, com required reviewers — **Resposta:** maioria via `.env`; o que precisar para CI/CD vai nos Secrets do GitHub.
- [x] Categorias iniciais de presentes — **Resposta:** Cozinha & Eletrodomésticos, Sala & Decoração, Quarto & Banho, Lua de Mel & Experiências, Casa Nova / Cotas Livres, Divertidos / Zoeira.
- [x] O convidado pode criar presentes ou categorias? (assumido: não) — **Resposta:** Não.
- [x] Excluir presente com reserva ativa: manter o bloqueio? — **Resposta:** Sim, manter bloqueio.
- [x] Mudar modo ou preço de presente que já tem contribuições: bloquear? — **Resposta:** Sim, bloquear (não pode mudar).
- [x] Recado de confirmação do Pix mostra o nome do convidado: anonimizar? — **Resposta:** Colocar opção para o convidado decidir se é anônimo ou não.
- [x] Prazo de RSVP vazio deixa o RSVP aberto para sempre: é intencional? — **Resposta:** Sim, manter opcional (vazio = sempre aberto).
- [x] Perfil do convidado é só leitura: ele pode editar o próprio telefone? — **Resposta:** Convidado pode editar suas informações; ao acessar com o código, preencherá nome, telefone, e-mail e seus familiares.
- [x] Limite de 8 MB de upload só é checado no servidor: travar também no Cloudinary com upload preset? — **Resposta:** Sim, travar também no Cloudinary.
