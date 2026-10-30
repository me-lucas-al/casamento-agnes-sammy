import { ImageResponse } from "next/og";
import { readMonogramDataUri } from "@/shared/seo/read-brand-asset";
import { AppIcon } from "@/shared/seo/app-icon";

export const size = { width: 180, height: 180 };
export const contentType = "image/png";

export default async function AppleIcon() {
  const monogramSrc = await readMonogramDataUri();
  return new ImageResponse(<AppIcon monogramSrc={monogramSrc} edge={size.width} />, size);
}
