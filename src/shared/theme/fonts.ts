import { Allura, Cormorant_Garamond, Playfair_Display } from "next/font/google";

const cormorantGaramond = Cormorant_Garamond({
  variable: "--font-cormorant",
  subsets: ["latin"],
  weight: ["400", "500", "600", "700"],
  style: ["normal", "italic"],
});

const allura = Allura({
  variable: "--font-allura",
  subsets: ["latin"],
  weight: "400",
});

const playfairDisplay = Playfair_Display({
  variable: "--font-playfair",
  subsets: ["latin"],
});

export const fontVariableClassNames = [
  cormorantGaramond.variable,
  allura.variable,
  playfairDisplay.variable,
].join(" ");
