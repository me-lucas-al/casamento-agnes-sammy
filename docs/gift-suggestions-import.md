# Gift suggestions import

The verified product catalog under `src/modules/gift-suggestions/data/verified` is generated, never edited by hand.

## Input

Research JSON files live in `.scratch/research/*.json` (the folder is not committed). The file name decides the category, for example `cozinha-eletro.json` or `sala-decoracao.json`. Each file has `checkedAt` (ISO date) and a `products` array.

## Regenerate

1. Put or update the research files in `.scratch/research/`.
2. Run `pnpm suggestions:import`.
3. Review the printed accepted and dropped products, then `git diff` the data folder.

## Rules

- Files and products are sorted before de-duplication, so the same input always yields the same output.
- The whole catalog is rendered in memory first; stale folders are removed and files written only after that succeeds.
- Product urls must be https on an allowed store, without credentials, ports or tracking params.
- Image urls must be https on a host listed in `src/shared/lib/images/allowed-image-hosts.ts`. That list is maintained by hand and the importer never edits it; products on other hosts are dropped with the reason printed.
