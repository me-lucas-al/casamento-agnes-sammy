import { DEFAULT_CATEGORIES } from "@/modules/gifts/lib/catalog/default-categories";
import type { CategoryRepository } from "@/modules/gifts/repositories/contracts/category-repository";
import type { GiftCategory } from "@/modules/gifts/types";

type Dependencies = { categoryRepository: CategoryRepository };

export function makeEnsureDefaultCategories({ categoryRepository }: Dependencies) {
  return async function ensureDefaultCategories(): Promise<GiftCategory[]> {
    const existingCategories = await categoryRepository.list();
    const existingNames = new Set(existingCategories.map((category) => category.name));
    const missingCategories = DEFAULT_CATEGORIES.filter((category) => !existingNames.has(category.name));
    const createdCategories: GiftCategory[] = [];
    for (const category of missingCategories) {
      createdCategories.push(await categoryRepository.create(category));
    }
    return createdCategories;
  };
}
