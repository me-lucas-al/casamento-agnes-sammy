import { count, eq } from "drizzle-orm";
import { giftCategories, gifts } from "@/shared/db/schema";
import type { Database } from "@/shared/db/types";
import type { GiftRepository } from "./gift-repository";
import { deleteGiftUnlessCommitted } from "./drizzle-gift-deletion";
import { hasConfirmedContribution, sumActiveContributions } from "./drizzle-contribution-totals";
import { existsGiftWithImagePublicId } from "./drizzle-gift-image-query";
import { updateGiftUnlessPricingLocked } from "./drizzle-gift-update";
import { buildGiftFilters, buildGiftOrder } from "./drizzle-gift-list-query";

export function createDrizzleGiftRepository(database: Database): GiftRepository {
  return {
    existsWithImagePublicId(publicId, excludedGiftId) {
      return existsGiftWithImagePublicId(database, publicId, excludedGiftId);
    },
    async findById(giftId) {
      const [gift] = await database.select().from(gifts).where(eq(gifts.id, giftId)).limit(1);
      return gift ?? null;
    },
    async create(draft) {
      const [gift] = await database.insert(gifts).values(draft).returning();
      return gift;
    },
    updateUnlessPricingLocked: (giftId, draft, now) => updateGiftUnlessPricingLocked(database, giftId, draft, now),
    async listPage(query) {
      const filters = buildGiftFilters(query);
      const [rows, [totalRow]] = await Promise.all([
        database
          .select({ gift: gifts, categoryName: giftCategories.name })
          .from(gifts)
          .innerJoin(giftCategories, eq(gifts.categoryId, giftCategories.id))
          .where(filters)
          .orderBy(...buildGiftOrder(query.sort))
          .limit(query.limit)
          .offset(query.offset),
        database.select({ total: count() }).from(gifts).where(filters),
      ]);
      const items = rows.map(({ gift, categoryName }) => ({ ...gift, categoryName }));
      return { items, total: totalRow?.total ?? 0 };
    },
    deleteUnlessCommitted: (giftId, now) => deleteGiftUnlessCommitted(database, giftId, now),
    hasConfirmedContribution: (giftId) => hasConfirmedContribution(database, giftId),
    sumActiveContributions: (giftIds, now) => sumActiveContributions(database, giftIds, now),
  };
}
