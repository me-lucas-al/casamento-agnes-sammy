# Casamento Agnes & Sammy

Source of truth: `SPECS.md` (read fully before coding). Next.js docs for the installed version: `node_modules/next/dist/docs/`.

## Commands

- `pnpm lint` (ESLint + `scripts/check-file-lines.mjs`), `pnpm tsc --noEmit`, `pnpm test` (unit + integration, PGlite)
- `pnpm db:generate` after changing any `src/modules/*/schema.ts`; `pnpm db:migrate`; `pnpm db:seed-admin`

## Module layout

`src/modules/<name>/{controllers,use-cases,repositories,schemas,components,lib}`, `schema.ts`, `errors.ts`, `types.ts`, `factory.ts`. Copy `src/modules/users` as the template.

- Controllers (`*.actions.ts` with 'use server', `*.queries.ts`): validate with Zod, get session user, call use-case, invalidate cache tags, return `ActionResult`.
- Use-cases: one per file, receive repository interfaces and `actor: SessionUser`, call `requireRole`. Never import db, `next/*` or auth config (ESLint enforces).
- Repositories: interface + Drizzle implementation typed with `Database` from `@/shared/db/types`.
- `factory.ts`: composition root, the only file that knows the Drizzle implementation.
- Tables already exist for all modules; never edit `src/shared/db/*` except through a module `schema.ts` + `pnpm db:generate`.

## Rules

Max 150 lines per file, no comments, no `any`, no `import * as React`, money in cents, early returns, explicit names. Semantic English commits, small, `git add <paths>`, no Claude attribution.

Commits: one commit per completed task, clear Conventional Commits message in English (feat, fix, refactor, chore, docs, test, style), small, exact paths, no Claude attribution.

## Tests

Integration tests in `src/tests/integration/<module>/*.test.ts` use `useTestDatabase()` and seeds from `src/tests/helpers`. Unit tests sit next to the file as `*.test.ts`.

## Shared building blocks

- Test helpers: `useTestDatabase()`, seeds in `src/tests/helpers/seeds/*`, `asUser(role)`, `FakeCacheInvalidator`, `FakeCloudinaryClient`.
- Cache: `CachedReader` (`nextCachedReader` / `passThroughCachedReader`) and `CacheInvalidator` (`nextCacheInvalidator`) in `src/shared/lib/cache`; tags in `cache-tags.ts`.
- Next 16 here: `src/proxy.ts` (not middleware), `cacheComponents` off, `unstable_cache` + `revalidateTag(tag, { expire: 0 })`.
