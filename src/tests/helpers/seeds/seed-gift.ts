import { giftCategories, gifts } from "@/shared/db/schema";
import type { Database } from "@/shared/db/types";

type CategoryOverrides = Partial<typeof giftCategories.$inferInsert>;
type GiftOverrides = Partial<typeof gifts.$inferInsert>;

export async function seedGiftCategory(db: Database, overrides: CategoryOverrides = {}) {
  const [category] = await db
    .insert(giftCategories)
    .values({ name: "Casa", ...overrides })
    .returning();
  return category;
}

export async function seedGift(db: Database, overrides: GiftOverrides = {}) {
  const categoryId = overrides.categoryId ?? (await seedGiftCategory(db)).id;
  const [gift] = await db
    .insert(gifts)
    .values({ name: "Jogo de panelas", priceCents: 30000, mode: "single", ...overrides, categoryId })
    .returning();
  return gift;
}
