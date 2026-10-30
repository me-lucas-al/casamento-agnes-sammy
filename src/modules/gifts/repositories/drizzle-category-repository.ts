import { asc, eq } from "drizzle-orm";
import { giftCategories, gifts } from "@/shared/db/schema";
import type { Database } from "@/shared/db/types";
import type { CategoryRepository } from "./category-repository";

export function createDrizzleCategoryRepository(database: Database): CategoryRepository {
  return {
    async findById(categoryId) {
      const [category] = await database
        .select()
        .from(giftCategories)
        .where(eq(giftCategories.id, categoryId))
        .limit(1);
      return category ?? null;
    },
    list() {
      return database
        .select()
        .from(giftCategories)
        .orderBy(asc(giftCategories.sortOrder), asc(giftCategories.name));
    },
    async create(input) {
      const [category] = await database.insert(giftCategories).values(input).returning();
      return category;
    },
    async update(categoryId, input) {
      const [category] = await database
        .update(giftCategories)
        .set(input)
        .where(eq(giftCategories.id, categoryId))
        .returning();
      return category;
    },
    async delete(categoryId) {
      await database.delete(giftCategories).where(eq(giftCategories.id, categoryId));
    },
    async hasGifts(categoryId) {
      const [row] = await database
        .select({ id: gifts.id })
        .from(gifts)
        .where(eq(gifts.categoryId, categoryId))
        .limit(1);
      return Boolean(row);
    },
  };
}
