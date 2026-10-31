export const ACCESS_CODE_LENGTH = 8;

const NOT_ALLOWED_CHARACTERS = /[^A-Z0-9]/g;

export function normalizeAccessCode(rawCode: string): string {
  return rawCode.toUpperCase().replace(NOT_ALLOWED_CHARACTERS, "").slice(0, ACCESS_CODE_LENGTH);
}
