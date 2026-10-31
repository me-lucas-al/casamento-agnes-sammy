import { z } from "zod";
import { STORE_NAME_BY_HOST } from "@/modules/gifts/lib/product/allowed-store-hosts";
import { hasTrackingParams, isAllowedProductUrl } from "@/modules/gifts/lib/product/product-link-rules";
import { isValidIsoDate } from "@/shared/lib/dates/iso-date";
import type { SuggestionCategoryKey } from "@/modules/gift-suggestions/data/category-names";
import { slugify } from "@/modules/gift-suggestions/data/suggestion-builders";
import type { VerifiedProductRecord } from "@/modules/gift-suggestions/types";
import { mapProductType } from "./map-product-type";

const FORBIDDEN_IMAGE_HOST_PATTERN = /shopee|aliexpress|shein|temu|wish\.com|alibaba|alicdn/i;
const MAX_PRICE_CENTS = 100_000_000;
const MIN_QUOTAS = 2;
const MAX_QUOTAS = 10;

export const researchProductSchema = z.object({
  id: z.string().min(1),
  name: z.string().trim().min(2).max(120),
  description: z.string().trim().min(1).max(1000),
  type: z.string().default(""),
  store: z.string().min(1),
  productUrl: z.string().min(1),
  imageUrl: z.string().min(1),
  priceCents: z.number(),
  kind: z.literal("item"),
  mode: z.enum(["single", "fixed_quotas"]),
  totalQuotas: z.number().optional(),
});

export type ResearchProduct = z.infer<typeof researchProductSchema>;

export type ProductValidation = { ok: true; record: VerifiedProductRecord } | { ok: false; reason: string };

function describeImageProblem(imageUrl: string): string | null {
  if (!URL.canParse(imageUrl)) return "image url is not a url";
  const parsed = new URL(imageUrl);
  if (parsed.protocol !== "https:") return "image url must be https";
  return FORBIDDEN_IMAGE_HOST_PATTERN.test(parsed.hostname) ? "image host is forbidden" : null;
}

function describeQuotaProblem({ mode, totalQuotas, priceCents }: ResearchProduct): string | null {
  if (mode === "single") return totalQuotas === undefined ? null : "single mode takes no quotas";
  const quotas = Number(totalQuotas);
  if (!Number.isInteger(quotas) || quotas < MIN_QUOTAS || quotas > MAX_QUOTAS) return "quota count must be between 2 and 10";
  return priceCents < quotas * 100 ? "quota value below R$ 1" : null;
}

function describeProductProblem(product: ResearchProduct): string | null {
  if (!isAllowedProductUrl(product.productUrl)) return "product url is not https on an allowed store";
  if (hasTrackingParams(product.productUrl)) return "product url has tracking params";
  if (STORE_NAME_BY_HOST[new URL(product.productUrl).hostname] !== product.store) return "store does not match product url";
  const { priceCents } = product;
  if (!Number.isInteger(priceCents) || priceCents < 1 || priceCents > MAX_PRICE_CENTS) {
    return "price is not a positive integer in cents";
  }
  return describeQuotaProblem(product) ?? describeImageProblem(product.imageUrl);
}

function buildId(categoryKey: SuggestionCategoryKey, rawId: string): string {
  const slug = slugify(rawId);
  return slug.startsWith(`${categoryKey}-`) ? slug : `${categoryKey}-${slug}`;
}

export function validateResearchProduct(
  raw: unknown,
  categoryKey: SuggestionCategoryKey,
  checkedAt: string,
): ProductValidation {
  const parsed = researchProductSchema.safeParse(raw);
  if (!parsed.success) return { ok: false, reason: `invalid shape: ${parsed.error.issues[0]?.path.join(".")}` };
  if (!isValidIsoDate(checkedAt)) return { ok: false, reason: "invalid checkedAt date" };
  const problem = describeProductProblem(parsed.data);
  if (problem) return { ok: false, reason: problem };
  const { name, description, productUrl, imageUrl, priceCents, mode, totalQuotas, type } = parsed.data;
  const record: VerifiedProductRecord = {
    id: buildId(categoryKey, parsed.data.id),
    name,
    description,
    type: mapProductType(type, categoryKey),
    productUrl,
    imageUrl,
    priceCents,
    mode,
    ...(totalQuotas === undefined ? {} : { totalQuotas }),
    checkedAt,
  };
  return { ok: true, record };
}
