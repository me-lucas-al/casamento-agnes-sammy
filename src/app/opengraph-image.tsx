import { ImageResponse } from "next/og";
import { getEventSettingsQuery } from "@/modules/event/controllers/event.queries";
import { readMonogramDataUri, readSocialCardFonts } from "@/shared/seo/read-brand-asset";
import { SocialCard } from "@/shared/seo/social-card";
import { buildSocialCardCopy } from "@/shared/seo/social-card-copy";

export const alt = "Agnes & Sammy vão se casar";
export const size = { width: 1200, height: 630 };
export const contentType = "image/png";

export default async function OpenGraphImage() {
  const [settings, monogramSrc, fonts] = await Promise.all([
    getEventSettingsQuery(),
    readMonogramDataUri(),
    readSocialCardFonts(),
  ]);
  const copy = buildSocialCardCopy({
    coupleNames: settings.coupleNames,
    eventAt: new Date(settings.eventAt),
    venueName: settings.venueName,
  });
  return new ImageResponse(<SocialCard copy={copy} monogramSrc={monogramSrc} />, { ...size, fonts });
}
