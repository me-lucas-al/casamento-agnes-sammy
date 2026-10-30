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
- [ ] Revisão final de design (responsividade, fidelidade ao convite, acabamento)

## Faltam
- [x] Painel inicial com totais (reservas, pagamentos pendentes, presenças, moderação)
- [x] Campo para editar legenda de foto na galeria
- [x] Imagem de compartilhamento (OG) com monograma, metadados de SEO e `robots.txt`
- [x] Passe de acessibilidade e Lighthouse
- [x] Teste de ponta a ponta no navegador (código, reservar, Pix, confirmar, progresso)
- [x] Tratamento global de erros (global-error, wrapper de Server Actions, logger central, erros de API)
- [x] Índices únicos em photos.cloudinary_public_id e gifts.image_public_id
- [ ] Índice único em `photos.cloudinary_public_id` e `gifts.image_public_id`
- [ ] Primeiro disparo real do workflow de migration em produção
- [ ] Deploy em produção (Vercel + Neon) e domínio
- [ ] Build rodando em `localhost:3000`

## Dados pendentes do casal
- [ ] Chave Pix, tipo, nome do recebedor e cidade
- [ ] Texto "nossa história" e fotos do casal
- [ ] E-mails Google do admin e dos noivos, e domínio do site
- [ ] Credenciais: Neon, Cloudinary, Google OAuth, projeto Vercel, secret `DATABASE_URL` no GitHub
- [ ] Categorias iniciais de presentes
