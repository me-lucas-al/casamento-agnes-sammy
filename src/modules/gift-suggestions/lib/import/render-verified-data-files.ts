import type { ImportedProduct } from "./collect-research-products";

export type GeneratedFile = { path: string; content: string };

const PRODUCTS_PER_FILE = 8;
const VERIFIED_DIRECTORY = "src/modules/gift-suggestions/data/verified";
const HOSTS_FILE = "src/shared/lib/images/allowed-image-hosts.ts";
const ALWAYS_ALLOWED_IMAGE_HOSTS = ["res.cloudinary.com"];

function toConstantName(...parts: (string | number)[]): string {
  return parts.join("_").toUpperCase().replace(/[^A-Z0-9]+/g, "_");
}

function chunk<Item>(items: readonly Item[], size: number): Item[][] {
  const chunks: Item[][] = [];
  for (let start = 0; start < items.length; start += size) chunks.push(items.slice(start, start + size));
  return chunks;
}

function renderRecordsFile(name: string, records: readonly ImportedProduct["record"][]): string {
  const body = records.map((record) => JSON.stringify(record, null, 2).replace(/^/gm, "  ")).join(",\n");
  return [
    'import type { VerifiedProductRecord } from "../../../types";',
    "",
    `export const ${name}: readonly VerifiedProductRecord[] = [`,
    `${body},`,
    "];",
    "",
  ].join("\n");
}

function renderCategoryIndex(categoryKey: string, entries: readonly { name: string; file: string }[]): string {
  const imports = entries.map(({ name, file }) => `import { ${name} } from "./${file}";`);
  const spreads = entries.map(({ name }) => `  ...${name},`);
  return [
    'import type { VerifiedProductRecord } from "../../../types";',
    ...imports,
    "",
    `export const ${toConstantName(categoryKey, "verified")}: readonly VerifiedProductRecord[] = [`,
    ...spreads,
    "];",
    "",
  ].join("\n");
}

function renderRootIndex(categoryKeys: readonly string[]): string {
  const imports = categoryKeys.map((key) => `import { ${toConstantName(key, "verified")} } from "./${key}";`);
  const entries = categoryKeys.map((key) => `  ...hydrateVerifiedProducts("${key}", ${toConstantName(key, "verified")}),`);
  return [
    'import type { GiftSuggestion } from "../../types";',
    'import { hydrateVerifiedProducts } from "./hydrate-verified-products";',
    ...imports,
    "",
    "export const VERIFIED_SUGGESTIONS: readonly GiftSuggestion[] = [",
    ...entries,
    "];",
    "",
  ].join("\n");
}

export function renderAllowedImageHosts(products: readonly ImportedProduct[]): GeneratedFile {
  const hostnames = products.map(({ record }) => new URL(record.imageUrl).hostname);
  const hosts = [...new Set([...ALWAYS_ALLOWED_IMAGE_HOSTS, ...hostnames])].sort();
  const lines = hosts.map((host) => `  "${host}",`);
  const content = ["export const ALLOWED_IMAGE_HOSTS: readonly string[] = [", ...lines, "];", ""].join("\n");
  return { path: HOSTS_FILE, content };
}

export function renderVerifiedDataFiles(products: readonly ImportedProduct[]): GeneratedFile[] {
  const categoryKeys = [...new Set(products.map(({ categoryKey }) => categoryKey))].sort();
  const files: GeneratedFile[] = [];
  for (const categoryKey of categoryKeys) {
    const entries: { name: string; file: string }[] = [];
    const categoryRecords = products.filter((product) => product.categoryKey === categoryKey).map(({ record }) => record);
    const types = [...new Set(categoryRecords.map((record) => record.type))].sort();
    for (const type of types) {
      const records = categoryRecords.filter((record) => record.type === type);
      chunk(records, PRODUCTS_PER_FILE).forEach((part, index) => {
        const file = `${type}-${index + 1}`;
        const name = toConstantName(categoryKey, type, index + 1);
        entries.push({ name, file });
        files.push({ path: `${VERIFIED_DIRECTORY}/${categoryKey}/${file}.ts`, content: renderRecordsFile(name, part) });
      });
    }
    files.push({ path: `${VERIFIED_DIRECTORY}/${categoryKey}/index.ts`, content: renderCategoryIndex(categoryKey, entries) });
  }
  files.push({ path: `${VERIFIED_DIRECTORY}/verified-suggestions.ts`, content: renderRootIndex(categoryKeys) });
  return files;
}
