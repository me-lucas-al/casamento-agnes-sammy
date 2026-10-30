import { count } from "drizzle-orm";
import { eventSettings, gifts, photos } from "@/shared/db/schema";
import type { Database } from "@/shared/db/types";
import type { OnboardingFacts } from "../types";

function hasText(value: string | null | undefined): boolean {
  return Boolean(value && value.trim().length > 0);
}

export async function readOnboardingFacts(database: Database): Promise<OnboardingFacts> {
  const [[settings], [photoRow], [giftRow]] = await Promise.all([
    database.select().from(eventSettings).limit(1),
    database.select({ total: count() }).from(photos),
    database.select({ total: count() }).from(gifts),
  ]);
  const hasPixData =
    hasText(settings?.pixKey) &&
    Boolean(settings?.pixKeyType) &&
    hasText(settings?.pixReceiverName) &&
    hasText(settings?.pixCity);
  return {
    hasPixData,
    hasStory: hasText(settings?.story),
    photoCount: photoRow?.total ?? 0,
    giftCount: giftRow?.total ?? 0,
  };
}
