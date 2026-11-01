import { hasPlainHttpsOrigin } from "@/shared/lib/url/plain-https-origin";
import { ALLOWED_IMAGE_HOSTS } from "./allowed-image-hosts";

export function isAllowedImageUrl(url: string, allowedHosts: readonly string[] = ALLOWED_IMAGE_HOSTS): boolean {
  if (!URL.canParse(url)) return false;
  const parsed = new URL(url);
  return hasPlainHttpsOrigin(parsed) && allowedHosts.includes(parsed.hostname);
}
