const ACCESS_CODE_PARAM = "codigo";

export function removeAccessCodeFromUrl(currentUrl: string): string | null {
  const url = new URL(currentUrl);
  if (!url.searchParams.has(ACCESS_CODE_PARAM)) return null;
  url.searchParams.delete(ACCESS_CODE_PARAM);
  return `${url.pathname}${url.search}${url.hash}`;
}
