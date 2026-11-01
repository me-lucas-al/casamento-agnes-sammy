import { mkdirSync, readdirSync, readFileSync, rmSync, writeFileSync } from "node:fs";
import { dirname, join } from "node:path";
import { collectResearchProducts, type ResearchSource } from "../src/modules/gift-suggestions/lib/import/collect-research-products";
import { categoryKeyOfResearchFile } from "../src/modules/gift-suggestions/lib/import/research-file-category";
import { renderVerifiedDataFiles } from "../src/modules/gift-suggestions/lib/import/render-verified-data-files";

const RESEARCH_DIRECTORY = join(process.cwd(), ".scratch", "research");

function readSources(): ResearchSource[] {
  const sources: ResearchSource[] = [];
  for (const fileName of readdirSync(RESEARCH_DIRECTORY).filter((name) => name.endsWith(".json"))) {
    const categoryKey = categoryKeyOfResearchFile(fileName);
    if (!categoryKey) {
      console.warn(`skipped ${fileName}: unknown category`);
      continue;
    }
    try {
      sources.push({ fileName, categoryKey, content: JSON.parse(readFileSync(join(RESEARCH_DIRECTORY, fileName), "utf8")) });
    } catch {
      console.warn(`skipped ${fileName}: invalid JSON`);
    }
  }
  return sources;
}

const VERIFIED_DIRECTORY = join(process.cwd(), "src", "modules", "gift-suggestions", "data", "verified");

function removeStaleCategoryFolders() {
  for (const entry of readdirSync(VERIFIED_DIRECTORY, { withFileTypes: true })) {
    if (entry.isDirectory()) rmSync(join(VERIFIED_DIRECTORY, entry.name), { recursive: true, force: true });
  }
}

function writeFiles(files: readonly { path: string; content: string }[]) {
  for (const file of files) {
    const target = join(process.cwd(), file.path);
    mkdirSync(dirname(target), { recursive: true });
    writeFileSync(target, file.content, "utf8");
  }
}

function printReport({ products, dropped }: ReturnType<typeof collectResearchProducts>) {
  const countByCategory = new Map<string, number>();
  for (const { categoryKey } of products) countByCategory.set(categoryKey, (countByCategory.get(categoryKey) ?? 0) + 1);
  console.log(`accepted ${products.length} products`, Object.fromEntries(countByCategory));
  console.log(`dropped ${dropped.length} products`);
  for (const item of dropped) console.log(`  ${item.fileName} ${item.id}: ${item.reason}`);
}

function main() {
  const result = collectResearchProducts(readSources());
  printReport(result);
  if (result.products.length === 0) {
    console.error("nothing to write");
    process.exitCode = 1;
    return;
  }
  removeStaleCategoryFolders();
  writeFiles(renderVerifiedDataFiles(result.products));
}

main();
