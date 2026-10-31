const COUNTRY_CODE = "55";
const MIN_NATIONAL_DIGITS = 10;
const MAX_NATIONAL_DIGITS = 11;
const ALLOWED_CHARACTERS = /^[\d\s()+-]+$/;

export function normalizeBrazilianPhone(rawPhone: string): string | null {
  const trimmed = rawPhone.trim();
  if (!ALLOWED_CHARACTERS.test(trimmed)) return null;
  const digits = trimmed.replace(/\D/g, "");
  if (digits.length >= MIN_NATIONAL_DIGITS && digits.length <= MAX_NATIONAL_DIGITS) return digits;
  const hasCountryCode = digits.startsWith(COUNTRY_CODE);
  const nationalLength = digits.length - COUNTRY_CODE.length;
  const isNationalLengthValid = nationalLength >= MIN_NATIONAL_DIGITS && nationalLength <= MAX_NATIONAL_DIGITS;
  return hasCountryCode && isNationalLengthValid ? digits : null;
}
