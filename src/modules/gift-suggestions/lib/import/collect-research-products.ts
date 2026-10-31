import { z } from "zod";
import type { SuggestionCategoryKey } from "@/modules/gift-suggestions/data/category-names";
import type { VerifiedProductRecord } from "@/modules/gift-suggestions/types";
import { normalizeGiftName } from "../catalog/normalize-gift-name";
import { validateResearchProduct } from "./validate-research-product";

export type ResearchSource = {
  fileName: string;
  categoryKey: SuggestionCategoryKey;
  content: unknown;
};

export type ImportedProduct = { categoryKey: SuggestionCategoryKey; record: VerifiedProductRecord };

export type DroppedProduct = { fileName: string; id: string; reason: string };

export type CollectedProducts = { products: ImportedProduct[]; dropped: DroppedProduct[] };

const researchFileSchema = z.object({
  checkedAt: z.string(),
  products: z.array(z.unknown()),
});

const idOnlySchema = z.object({ id: z.string() });

function productIdOf(raw: unknown): string {
  const parsed = idOnlySchema.safeParse(raw);
  return parsed.success ? parsed.data.id : "(no id)";
}

function canonicalUrl(url: string): string {
  const parsed = new URL(url);
  return `${parsed.hostname}${parsed.pathname.replace(/\/+$/, "")}`;
}

function createDuplicateTracker() {
  const seenIds = new Set<string>();
  const seenUrls = new Set<string>();
  const seenNames = new Set<string>();
  return function findDuplicateReason(record: VerifiedProductRecord): string | null {
    const urlKey = canonicalUrl(record.productUrl);
    const nameKey = normalizeGiftName(record.name);
    if (seenIds.has(record.id)) return "duplicated id";
    if (seenUrls.has(urlKey)) return "duplicated product url";
    if (seenNames.has(nameKey)) return "duplicated name";
    seenIds.add(record.id);
    seenUrls.add(urlKey);
    seenNames.add(nameKey);
    return null;
  };
}

export function collectResearchProducts(sources: readonly ResearchSource[]): CollectedProducts {
  const products: ImportedProduct[] = [];
  const dropped: DroppedProduct[] = [];
  const findDuplicateReason = createDuplicateTracker();

  for (const { fileName, categoryKey, content } of sources) {
    const file = researchFileSchema.safeParse(content);
    if (!file.success) {
      dropped.push({ fileName, id: "(file)", reason: "file does not match the research schema" });
      continue;
    }
    for (const raw of file.data.products) {
      const validation = validateResearchProduct(raw, categoryKey, file.data.checkedAt);
      const reason = validation.ok ? findDuplicateReason(validation.record) : validation.reason;
      if (reason || !validation.ok) {
        dropped.push({ fileName, id: productIdOf(raw), reason: reason ?? "invalid" });
        continue;
      }
      products.push({ categoryKey, record: validation.record });
    }
  }
  return { products, dropped };
}
