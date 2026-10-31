import { DEFAULT_CATEGORIES } from "@/modules/gifts/lib/default-categories";
import type { GiftModule } from "@/modules/gifts/factory";
import type { SuggestionGiftGateway } from "../ports";

const MAX_LISTED_GIFTS = 5000;

function sortOrderForCategory(categoryName: string, existingCount: number): number {
  const defaultCategory = DEFAULT_CATEGORIES.find((category) => category.name === categoryName);
  return defaultCategory?.sortOrder ?? existingCount;
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
      const created = await categoryRepository.create({ name, sortOrder: sortOrderForCategory(name, existing.length) });
      return { id: created.id, name: created.name };
    },
    async createGift(actor, input) {
      await giftModule.createGift(actor, input);
    },
  };
}
