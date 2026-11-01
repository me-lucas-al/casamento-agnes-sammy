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

type Candidate = ImportedProduct & { fileName: string };

function compareCandidates(left: Candidate, right: Candidate): number {
  return left.fileName.localeCompare(right.fileName) || left.record.id.localeCompare(right.record.id);
}

function validateSource({ fileName, categoryKey, content }: ResearchSource, dropped: DroppedProduct[]): Candidate[] {
  const file = researchFileSchema.safeParse(content);
  if (!file.success) {
    dropped.push({ fileName, id: "(file)", reason: "file does not match the research schema" });
    return [];
  }
  const candidates: Candidate[] = [];
  for (const raw of file.data.products) {
    const validation = validateResearchProduct(raw, categoryKey, file.data.checkedAt);
    if (!validation.ok) {
      dropped.push({ fileName, id: productIdOf(raw), reason: validation.reason });
      continue;
    }
    candidates.push({ fileName, categoryKey, record: validation.record });
  }
  return candidates;
}

export function collectResearchProducts(sources: readonly ResearchSource[]): CollectedProducts {
  const dropped: DroppedProduct[] = [];
  const candidates = sources.flatMap((source) => validateSource(source, dropped)).sort(compareCandidates);
  const findDuplicateReason = createDuplicateTracker();
  const products: ImportedProduct[] = [];
  for (const { fileName, categoryKey, record } of candidates) {
    const reason = findDuplicateReason(record);
    if (reason) {
      dropped.push({ fileName, id: record.id, reason });
      continue;
    }
    products.push({ categoryKey, record });
  }
  return { products, dropped };
}
