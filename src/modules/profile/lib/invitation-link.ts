export function buildInvitationLink(origin: string, code: string): string {
  const normalizedOrigin = origin.replace(/\/+$/, "");
  return `${normalizedOrigin}/entrar?codigo=${encodeURIComponent(code)}`;
}
