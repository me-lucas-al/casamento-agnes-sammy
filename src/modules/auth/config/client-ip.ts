import { createHash } from "node:crypto";

export function readClientIp(headers: Headers): string {
  const forwardedFor = headers.get("x-forwarded-for");
  if (forwardedFor) return forwardedFor.split(",")[0].trim();
  return headers.get("x-real-ip") ?? "unknown";
}

export function hashIpAddress(ipAddress: string, secret: string): string {
  return createHash("sha256").update(`${secret}:${ipAddress}`).digest("hex");
}
