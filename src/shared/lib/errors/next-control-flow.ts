const CONTROL_FLOW_DIGEST_PREFIXES = ["NEXT_REDIRECT", "NEXT_HTTP_ERROR_FALLBACK", "NEXT_NOT_FOUND"];
const DYNAMIC_USAGE_DIGEST = "DYNAMIC_SERVER_USAGE";
const BAILOUT_DIGEST = "BAILOUT_TO_CLIENT_SIDE_RENDERING";

function readDigest(error: unknown): string | null {
  if (typeof error !== "object" || error === null) return null;
  const { digest } = error as { digest?: unknown };
  return typeof digest === "string" ? digest : null;
}

export function isNextControlFlowError(error: unknown): boolean {
  const digest = readDigest(error);
  if (digest === null) return false;
  if (digest === DYNAMIC_USAGE_DIGEST || digest === BAILOUT_DIGEST) return true;
  return CONTROL_FLOW_DIGEST_PREFIXES.some((prefix) => digest.startsWith(prefix));
}
