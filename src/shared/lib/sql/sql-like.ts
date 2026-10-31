const LIKE_SPECIAL_CHARACTERS = /[\\%_]/g;

export function escapeLikePattern(rawValue: string): string {
  return rawValue.replace(LIKE_SPECIAL_CHARACTERS, (character) => `\\${character}`);
}

export function containsPattern(rawValue: string): string {
  return `%${escapeLikePattern(rawValue)}%`;
}
