import { GiftForm } from "@/modules/gifts/components/gift-form";
import { listGiftCategoriesQuery } from "@/modules/gifts/controllers/gifts.queries";
import { EmptyState } from "@/shared/ui/empty-state";

export default async function NewGiftPage() {
  const categories = await listGiftCategoriesQuery();

  return (
    <div className="flex w-full flex-col gap-6">
      <h1 className="font-serif text-2xl italic text-wine">Novo presente</h1>
      {categories.length === 0 ? (
        <EmptyState title="Crie uma categoria primeiro" description="Todo presente precisa de uma categoria." />
      ) : (
        <GiftForm categories={categories} />
      )}
    </div>
  );
}
