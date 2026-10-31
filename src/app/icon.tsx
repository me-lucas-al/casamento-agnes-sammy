import { ImageResponse } from "next/og";
import { readMonogramDataUri } from "@/shared/seo/images/read-brand-asset";
import { AppIcon } from "@/shared/seo/images/app-icon";

export const size = { width: 512, height: 512 };
export const contentType = "image/png";

export default async function Icon() {
  const monogramSrc = await readMonogramDataUri();
  return new ImageResponse(<AppIcon monogramSrc={monogramSrc} edge={size.width} />, size);
}
