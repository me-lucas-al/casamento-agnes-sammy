import { hasPlainHttpsOrigin } from "@/shared/lib/url/plain-https-origin";
import { ALLOWED_STORE_HOSTS, STORE_NAME_BY_HOST } from "./allowed-store-hosts";

const TRACKING_PARAM_PATTERN = /^(utm_|gclid$|fbclid$|msclkid$|gad_|tag$|ref$|ref_$|aff|affiliate|partner|cmpid$|sid$|pf_rd_|pd_rd_|psc$)/i;

function parseHttpsUrl(url: string): URL | null {
  if (!URL.canParse(url)) return null;
  const parsed = new URL(url);
  return hasPlainHttpsOrigin(parsed) ? parsed : null;
}

export function isAllowedProductUrl(url: string): boolean {
  const parsed = parseHttpsUrl(url);
  return parsed !== null && ALLOWED_STORE_HOSTS.includes(parsed.hostname);
}

export function hasTrackingParams(url: string): boolean {
  const parsed = parseHttpsUrl(url);
  if (!parsed) return false;
  return [...parsed.searchParams.keys()].some((key) => TRACKING_PARAM_PATTERN.test(key));
}

export function storeNameForProductUrl(url: string | null | undefined): string | null {
  if (!url) return null;
  const parsed = parseHttpsUrl(url);
  return parsed ? (STORE_NAME_BY_HOST[parsed.hostname] ?? null) : null;
}

export function formatPriceCheckedDate(isoDate: string | null | undefined): string | null {
  const match = isoDate?.match(/^(\d{4})-(\d{2})-(\d{2})/);
  return match ? `${match[3]}/${match[2]}/${match[1]}` : null;
}
