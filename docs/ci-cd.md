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

## Upload preset do Cloudinary (limite de 8 MB)

O app só envia imagens assinadas com um upload preset, e é o Cloudinary que barra arquivos acima de 8 MB.

1. No Cloudinary: **Settings > Upload > Upload presets > Add upload preset**.
2. Nome sugerido: `casamento_8mb`. Em **Signing mode**, escolha **Signed**.
3. Em **Upload control**, defina **Max file size** como `8388608` (8 MB) e formatos permitidos `jpg,png,webp`.
4. Salve e coloque o nome do preset em `CLOUDINARY_UPLOAD_PRESET`, no `.env` local e nas variáveis da Vercel.

Sem a variável `CLOUDINARY_UPLOAD_PRESET` o app não inicia.

## Seed das categorias de presentes

Depois de aplicar as migrations em um banco novo, crie as seis categorias iniciais:

```
pnpm db:seed-categories
```

O comando usa a `DATABASE_URL` do `.env`, só cria o que falta e pode ser repetido sem duplicar. Para produção, rode com a `DATABASE_URL` do Neon.

## Checklist manual de produção

Passos que dependem de contas externas e não são feitos pelo código:

- [ ] Criar o environment `production` no GitHub, com o secret `DATABASE_URL` e required reviewers.
- [ ] Rodar o workflow **Migrate production** pela primeira vez (Actions > Migrate production > Run workflow) e conferir `Migrations applied`.
- [ ] Criar o projeto na Vercel, ligar ao repositório e cadastrar as variáveis do `.env.example`.
- [ ] Criar o banco no Neon e usar a URL dele em `DATABASE_URL`.
- [ ] Criar o upload preset do Cloudinary e definir `CLOUDINARY_UPLOAD_PRESET`.
- [ ] Rodar `pnpm db:seed-admin` e `pnpm db:seed-categories` contra o banco de produção.
- [ ] Configurar `AUTH_GOOGLE_ID` e `AUTH_GOOGLE_SECRET` com a URL de produção em Authorized redirect URIs.
- [ ] Apontar o domínio na Vercel e atualizar `APP_URL`.
