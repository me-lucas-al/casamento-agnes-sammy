import { GiftCategoryManager } from "@/modules/gifts/components/gift-category-manager";
import { listGiftCategoriesQuery } from "@/modules/gifts/controllers/gifts.queries";

export default async function GiftCategoriesPage() {
  const categories = await listGiftCategoriesQuery();

  return (
    <div className="flex w-full flex-col gap-6">
      <h1 className="font-serif text-2xl italic text-wine">Categorias de presentes</h1>
      <GiftCategoryManager categories={categories} />
    </div>
  );
}
