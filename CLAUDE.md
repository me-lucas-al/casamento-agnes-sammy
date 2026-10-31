# Casamento Agnes & Sammy

Source of truth: `SPECS.md` (read fully before coding). Next.js docs for the installed version: `node_modules/next/dist/docs/`.

## Commands

- `pnpm lint` (ESLint + `scripts/check-file-lines.mjs`), `pnpm tsc --noEmit`, `pnpm test` (unit + integration, PGlite)
- `pnpm db:generate` after changing any `src/modules/*/schema.ts`; `pnpm db:migrate`; `pnpm db:seed-admin`

## Module layout

`src/modules/<name>/{controllers,use-cases,repositories,schemas,components,lib}`, `schema.ts`, `errors.ts`, `types.ts`, `factory.ts`. Copy `src/modules/users` as the template.

Folder rule: opening a folder must say what it is about. More than ~8 loose files means split into topic subfolders.

- `controllers/actions/` (`*.actions.ts`), `controllers/queries/` (`*.queries.ts`), other helpers in `controllers/handlers/` (or `guards/`, `session/`).
- `repositories/contracts/` (interfaces) and `repositories/drizzle/` (implementations, query files).
- `use-cases/<subdomain>/` when large (gifts: `catalog/ categories/ availability/ images/`; contributions: `reservation/ payment/ expiry/ listing/`).
- `components/<purpose>/` (`forms/ cards/ filters/ views/ ...`) and `lib/<theme>/` (`pricing/ images/ availability/ caches/ ...`).
- `shared/lib/<theme>/` (`cache api actions errors resilience cloudinary logging money dates pagination url sql styling`), `shared/ui/{primitives,dialogs,layout,forms,feedback,navigation}`, `shared/seo/{images,metadata}`. shadcn `ui` alias is `@/shared/ui/primitives`.

- Controllers (`*.actions.ts` with 'use server', `*.queries.ts`): validate with Zod, get session user, call use-case, invalidate cache tags, return `ActionResult`.
- Use-cases: one per file, receive repository interfaces and `actor: SessionUser`, call `requireRole`. Never import db, `next/*` or auth config (ESLint enforces).
- Repositories: interface + Drizzle implementation typed with `Database` from `@/shared/db/types`.
- `factory.ts`: composition root, the only file that knows the Drizzle implementation.
- Tables already exist for all modules; never edit `src/shared/db/*` except through a module `schema.ts` + `pnpm db:generate`.

## Rules

Max 150 lines per file, no comments, no `any`, no `import * as React`, money in cents, early returns, explicit names. Semantic English commits, small, `git add <paths>`, no Claude attribution.

Commits: one commit per completed task, clear Conventional Commits message in English (feat, fix, refactor, chore, docs, test, style), small, exact paths, no Claude attribution.

All screens must be responsive (mobile-first; 360px, 768px, 1280px). All secrets and DB credentials (including Docker Postgres) live in `.env` only, never hardcoded; `.env.example` has empty keys. Local DB: `docker compose up -d --wait` then `pnpm db:migrate`.

## Tests

Integration tests in `src/tests/integration/<module>/*.test.ts` use `useTestDatabase()` and seeds from `src/tests/helpers`. Unit tests live in a `tests/` subfolder of the folder they cover (e.g. `lib/pricing/tests/price-band.test.ts`); production folders hold no test files. Integration folders with more than ~12 files are split by topic.

## Shared building blocks

- Test helpers: `useTestDatabase()`, seeds in `src/tests/helpers/database/seeds/*`, fakes in `src/tests/helpers/fakes/*`, `asUser(role)`, `FakeCacheInvalidator`, `FakeCloudinaryClient`.
- Cache: `CachedReader` (`nextCachedReader` / `passThroughCachedReader`) and `CacheInvalidator` (`nextCacheInvalidator`) in `src/shared/lib/cache`; tags in `cache-tags.ts`.
- Next 16 here: `src/proxy.ts` (not middleware), `cacheComponents` off, `unstable_cache` + `revalidateTag(tag, { expire: 0 })`.
