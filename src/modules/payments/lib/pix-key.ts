import type { PixKeyType } from "../types";

const BRAZIL_COUNTRY_CODE = "+55";

export function normalizePixKey(pixKey: string, keyType: PixKeyType): string {
  const trimmed = pixKey.trim();
  if (keyType === "cpf" || keyType === "cnpj") return trimmed.replace(/\D/g, "");
  if (keyType === "email") return trimmed.toLowerCase();
  if (keyType !== "phone") return trimmed;
  const digits = trimmed.replace(/\D/g, "");
  return trimmed.startsWith("+") ? `+${digits}` : `${BRAZIL_COUNTRY_CODE}${digits}`;
}
