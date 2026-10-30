import { createHash } from "node:crypto";

const FINGERPRINT_LENGTH = 16;

function fingerprintClient(headers: Headers): string {
  const traits = `${headers.get("user-agent") ?? ""}|${headers.get("accept-language") ?? ""}`;
  const fingerprint = createHash("sha256").update(traits).digest("hex").slice(0, FINGERPRINT_LENGTH);
  return `unknown:${fingerprint}`;
}

export function readClientIp(headers: Headers): string {
  const forwardedFor = headers.get("x-forwarded-for");
  if (forwardedFor) return forwardedFor.split(",")[0].trim();
  return headers.get("x-real-ip") ?? fingerprintClient(headers);
}

export function hashIpAddress(ipAddress: string, secret: string): string {
  return createHash("sha256").update(`${secret}:${ipAddress}`).digest("hex");
}
