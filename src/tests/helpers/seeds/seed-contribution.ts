import { giftContributions } from "@/shared/db/schema";
import type { Database } from "@/shared/db/types";
import { addHours } from "@/shared/lib/dates/dates";
import { seedGift } from "./seed-gift";
import { seedGuest } from "./seed-guest";

type ContributionOverrides = Partial<typeof giftContributions.$inferInsert>;

export async function seedContribution(db: Database, overrides: ContributionOverrides = {}) {
  const giftId = overrides.giftId ?? (await seedGift(db)).id;
  const guestId = overrides.guestId ?? (await seedGuest(db)).id;
  const [contribution] = await db
    .insert(giftContributions)
    .values({
      amountCents: 30000,
      status: "reserved",
      expiresAt: addHours(new Date(), 48),
      ...overrides,
      giftId,
      guestId,
    })
    .returning();
  return contribution;
}
