const MASK_CHARACTER = "•";
const ALPHANUMERIC = /[\p{L}\p{N}]/u;

type MaskOptions = { keepHead: number; keepTail: number };

export function maskAlphanumerics(value: string, { keepHead, keepTail }: MaskOptions): string {
  const characters = Array.from(value);
  const total = characters.filter((character) => ALPHANUMERIC.test(character)).length;
  if (total <= keepHead + keepTail) return characters.map((character) => (ALPHANUMERIC.test(character) ? MASK_CHARACTER : character)).join("");
  let position = 0;
  return characters
    .map((character) => {
      if (!ALPHANUMERIC.test(character)) return character;
      position += 1;
      const isVisible = position <= keepHead || position > total - keepTail;
      return isVisible ? character : MASK_CHARACTER;
    })
    .join("");
}
