# CI/CD

## Visão geral

- O deploy do app é feito pela **Vercel**, com as variáveis de ambiente dela. O GitHub Actions não faz deploy do app.
- O GitHub Actions faz duas coisas: valida o código (CI) e aplica as migrations no banco de produção.

## Workflow CI (`.github/workflows/ci.yml`)

Roda em todo pull request e em todo push na `main`.

- Job `verify`: instala dependências, roda `pnpm lint`, `pnpm tsc --noEmit`, `pnpm test` e `pnpm build`. O build usa valores falsos (placeholders) definidos no próprio workflow. Nenhum segredo real é usado.
- Job `migrations-in-sync`: roda `pnpm db:generate`. Se o schema mudou e a migration não foi commitada, o job falha. Para corrigir: rode `pnpm db:generate` localmente e faça commit da pasta `src/shared/db/migrations`.

Os testes usam PGlite, então não precisam de banco no CI.

## Workflow Migrate production (`.github/workflows/migrate-production.yml`)

Roda quando o CI termina com sucesso na `main`, ou manualmente (`workflow_dispatch`).

1. Job `detect`: só segue se algo mudou em `src/shared/db/migrations/**`, `scripts/migrate.ts` ou `package.json` desde a última execução bem-sucedida. Na execução manual, sempre segue.
2. Job `migrate`: usa o environment `production`, instala dependências e aplica as migrations com `scripts/migrate.ts`.

Garantias:

- Nunca roda se o CI falhou.
- Nunca roda duas migrations ao mesmo tempo (grupo de concorrência `migrate-production`, sem cancelar a que está rodando).
- Só aplica migrations pendentes. Rodar de novo imprime `Migrations applied` e não muda nada.
- Não usa `--force` nem comandos de drop.

## Segredos

Crie em **Settings > Environments > production > Environment secrets**:

| Nome | Valor |
| --- | --- |
| `DATABASE_URL` | URL de conexão do banco de produção (Neon) |

Não coloque esse valor no repositório. As outras variáveis do app (`AUTH_SECRET`, `CLOUDINARY_*` etc.) ficam só na Vercel.

## Exigir aprovação antes de migrar (required reviewers)

1. No GitHub: **Settings > Environments > New environment**, nome `production` (ou abra o existente).
2. Marque **Required reviewers** e escolha quem aprova.
3. Salve. A partir daí, o job `migrate` fica esperando aprovação antes de tocar no banco.

## Fluxo completo

1. Abre PR. O CI valida.
2. Faz merge na `main`. O CI roda de novo.
3. Se houve mudança de migration e o CI passou, o job `migrate` espera aprovação (se configurada) e aplica no banco.
4. A Vercel faz o deploy do app por conta própria. Dica: para mudanças de schema, aprove a migration logo, pois o app novo pode depender dela.
