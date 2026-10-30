const POLYNOMIAL = 0x1021;
const INITIAL_VALUE = 0xffff;
const WORD_MASK = 0xffff;
const TOP_BIT = 0x8000;
const BITS_PER_BYTE = 8;

export function crc16Ccitt(text: string): string {
  let checksum = INITIAL_VALUE;
  for (let index = 0; index < text.length; index += 1) {
    checksum ^= text.charCodeAt(index) << BITS_PER_BYTE;
    for (let bit = 0; bit < BITS_PER_BYTE; bit += 1) {
      const carries = (checksum & TOP_BIT) !== 0;
      checksum = (checksum << 1) & WORD_MASK;
      if (carries) checksum ^= POLYNOMIAL;
    }
  }
  return checksum.toString(16).toUpperCase().padStart(4, "0");
}
