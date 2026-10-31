import { eq } from "drizzle-orm";
import { gifts } from "@/shared/db/schema";
import type { Database } from "@/shared/db/types";
import { hasGiftPricingChanged } from "@/modules/gifts/lib/pricing/gift-pricing-changed";
import type { GiftDraft } from "@/modules/gifts/types";
import { sumActiveContributions } from "./drizzle-contribution-totals";
import type { GiftUpdateOutcome } from "../contracts/gift-repository";

export function updateGiftUnlessPricingLocked(
  database: Database,
  giftId: string,
  draft: GiftDraft,
  now: Date,
): Promise<GiftUpdateOutcome> {
  return database.transaction(async (transaction) => {
    const [lockedGift] = await transaction
      .select()
      .from(gifts)
      .where(eq(gifts.id, giftId))
      .limit(1)
      .for("update");
    if (!lockedGift) return { status: "not_found" };
    if (hasGiftPricingChanged(lockedGift, draft)) {
      const activeTotals = await sumActiveContributions(transaction, [giftId], now);
      if (activeTotals.has(giftId)) return { status: "pricing_locked" };
    }
    const [gift] = await transaction.update(gifts).set(draft).where(eq(gifts.id, giftId)).returning();
    return { status: "updated", gift };
  });
}
