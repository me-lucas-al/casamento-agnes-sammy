import { formatLongDateInSaoPaulo } from "@/shared/lib/dates/dates";

export type SocialCardSource = { coupleNames: string; eventAt: Date; venueName: string };

export type SocialCardCopy = { coupleNames: string; dateText: string; venueText: string };

export function buildSocialCardCopy({ coupleNames, eventAt, venueName }: SocialCardSource): SocialCardCopy {
  return {
    coupleNames,
    dateText: formatLongDateInSaoPaulo(eventAt),
    venueText: venueName,
  };
}
