import { InvalidPixFieldError } from "../errors";

export function toPixAscii(value: string, maxLength: number, fieldName: string): string {
  const sanitized = value
    .normalize("NFD")
    .replace(/[̀-ͯ]/g, "")
    .replace(/[^A-Za-z0-9 ]/g, " ")
    .replace(/\s+/g, " ")
    .trim()
    .toUpperCase()
    .slice(0, maxLength)
    .trim();
  if (!sanitized) throw new InvalidPixFieldError(fieldName);
  return sanitized;
}
