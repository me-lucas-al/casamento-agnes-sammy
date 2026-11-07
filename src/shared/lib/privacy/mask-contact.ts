import { maskAlphanumerics } from "./mask-alphanumerics";

export function maskAccessCode(code: string): string {
  return maskAlphanumerics(code, { keepHead: 2, keepTail: 2 });
}

export function maskPhone(phone: string): string {
  return maskAlphanumerics(phone, { keepHead: 0, keepTail: 2 });
}

export function maskEmail(email: string): string {
  const separatorIndex = email.indexOf("@");
  if (separatorIndex <= 0) return maskAlphanumerics(email, { keepHead: 1, keepTail: 0 });
  const localPart = email.slice(0, separatorIndex);
  const domain = email.slice(separatorIndex);
  return `${maskAlphanumerics(localPart, { keepHead: 1, keepTail: 0 })}${domain}`;
}

export function maskPixKey(pixKey: string): string {
  if (pixKey.includes("@")) return maskEmail(pixKey);
  return maskAlphanumerics(pixKey, { keepHead: 0, keepTail: 2 });
}
