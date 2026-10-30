import { randomInt } from "node:crypto";

export const GUEST_CODE_ALPHABET = "ABCDEFGHJKMNPQRSTUVWXYZ23456789";
export const GUEST_CODE_LENGTH = 8;

export type RandomIndex = (limit: number) => number;

export type GuestCodeGenerator = () => string;

export function generateGuestCode(randomIndex: RandomIndex = randomInt): string {
  return Array.from(
    { length: GUEST_CODE_LENGTH },
    () => GUEST_CODE_ALPHABET[randomIndex(GUEST_CODE_ALPHABET.length)],
  ).join("");
}
