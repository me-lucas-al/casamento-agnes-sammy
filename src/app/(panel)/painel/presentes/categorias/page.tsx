import { GiftCategoryManager } from "@/modules/gifts/components/gift-category-manager";
import { listGiftCategoriesQuery } from "@/modules/gifts/controllers/gifts.queries";
import { PageHeading } from "@/shared/ui/components/page-heading";

export default async function GiftCategoriesPage() {
  const categories = await listGiftCategoriesQuery();

  return (
    <div className="flex w-full flex-col gap-6">
      <PageHeading title="Categorias de presentes" description="Organize a lista em grupos para os convidados encontrarem tudo fácil." align="start" />
      <GiftCategoryManager categories={categories} />
    </div>
  );
}
