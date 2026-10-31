import { timingSafeEqual } from "node:crypto";

const BEARER_PREFIX = "Bearer ";

export function isValidCronAuthorization(header: string | null, secret: string): boolean {
  if (!header || !header.startsWith(BEARER_PREFIX) || !secret) return false;
  const received = Buffer.from(header.slice(BEARER_PREFIX.length));
  const expected = Buffer.from(secret);
  if (received.length !== expected.length) return false;
  return timingSafeEqual(received, expected);
}
