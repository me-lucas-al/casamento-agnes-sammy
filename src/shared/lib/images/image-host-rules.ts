import { ALLOWED_IMAGE_HOSTS } from "./allowed-image-hosts";

export function isAllowedImageUrl(url: string, allowedHosts: readonly string[] = ALLOWED_IMAGE_HOSTS): boolean {
  if (!URL.canParse(url)) return false;
  const parsed = new URL(url);
  return parsed.protocol === "https:" && allowedHosts.includes(parsed.hostname);
}
