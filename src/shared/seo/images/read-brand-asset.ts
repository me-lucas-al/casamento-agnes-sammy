import { readFile } from "node:fs/promises";
import { join } from "node:path";

const MONOGRAM_PATH = join(process.cwd(), "public", "brand", "monogram.png");
const OG_FONTS_DIRECTORY = join(process.cwd(), "src", "shared", "theme", "og-fonts");

export async function readMonogramDataUri(): Promise<string> {
  const monogram = await readFile(MONOGRAM_PATH, "base64");
  return `data:image/png;base64,${monogram}`;
}

export async function readSocialCardFonts() {
  const [regular, italic] = await Promise.all([
    readFile(join(OG_FONTS_DIRECTORY, "cormorant-garamond-600.ttf")),
    readFile(join(OG_FONTS_DIRECTORY, "cormorant-garamond-italic-600.ttf")),
  ]);
  return [
    { name: "Cormorant", data: regular, weight: 600 as const, style: "normal" as const },
    { name: "Cormorant", data: italic, weight: 600 as const, style: "italic" as const },
  ];
}
