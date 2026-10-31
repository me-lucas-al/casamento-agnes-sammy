import { DEFAULT_CATEGORIES } from "@/modules/gifts/lib/catalog/default-categories";
import { GiftNameTakenError } from "@/modules/gifts/errors";
import type { GiftModule } from "@/modules/gifts/factory";
import { CATEGORY_NAME_UNIQUE_INDEX } from "@/modules/gifts/lib/catalog/reject-duplicate-name";
import { isUniqueViolation } from "@/shared/lib/errors/unique-violation";
import type { SuggestionCategory, SuggestionGiftGateway } from "../ports";

const MAX_LISTED_GIFTS = 5000;

function sortOrderForCategory(categoryName: string, existingCount: number): number {
  const defaultCategory = DEFAULT_CATEGORIES.find((category) => category.name === categoryName);
  return defaultCategory?.sortOrder ?? existingCount;
}

function findCategoryByName(
  categories: readonly SuggestionCategory[],
  name: string,
): SuggestionCategory {
  const existing = categories.find((category) => category.name.toLowerCase() === name.toLowerCase());
  if (!existing) throw new Error(`Category ${name} vanished after a unique violation`);
  return { id: existing.id, name: existing.name };
}

export function createGiftModuleGateway(giftModule: GiftModule): SuggestionGiftGateway {
  const { giftRepository, categoryRepository } = giftModule;
  return {
    async listGiftNames() {
      const page = await giftRepository.listPage({
        limit: MAX_LISTED_GIFTS,
        offset: 0,
        search: "",
        sort: "name",
        onlyVisible: false,
      });
      return page.items.map((gift) => gift.name);
    },
    async listCategories() {
      const categories = await categoryRepository.list();
      return categories.map(({ id, name }) => ({ id, name }));
    },
    async createCategory(name) {
      const existing = await categoryRepository.list();
      try {
        const created = await categoryRepository.create({ name, sortOrder: sortOrderForCategory(name, existing.length) });
        return { id: created.id, name: created.name };
      } catch (error) {
        if (!isUniqueViolation(error, CATEGORY_NAME_UNIQUE_INDEX)) throw error;
        return findCategoryByName(await categoryRepository.list(), name);
      }
    },
    async createGift(actor, input) {
      try {
        await giftModule.createGift(actor, input);
        return "created";
      } catch (error) {
        if (error instanceof GiftNameTakenError) return "duplicate";
        throw error;
      }
    },
  };
}
