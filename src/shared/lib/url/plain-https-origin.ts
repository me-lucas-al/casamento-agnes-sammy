export function hasPlainHttpsOrigin(url: URL): boolean {
  return url.protocol === "https:" && url.username === "" && url.password === "" && url.port === "";
}
