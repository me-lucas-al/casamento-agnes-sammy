import type { CategoryInput, GiftCategory } from "@/modules/gifts/types";

export interface CategoryRepository {
  findById(categoryId: string): Promise<GiftCategory | null>;
  list(): Promise<GiftCategory[]>;
  create(input: CategoryInput): Promise<GiftCategory>;
  update(categoryId: string, input: CategoryInput): Promise<GiftCategory>;
  delete(categoryId: string): Promise<void>;
  hasGifts(categoryId: string): Promise<boolean>;
}
