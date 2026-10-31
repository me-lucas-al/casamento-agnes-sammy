import { GiftForm } from "@/modules/gifts/components/form/gift-form";
import { listGiftCategoriesQuery } from "@/modules/gifts/controllers/queries/gifts.queries";
import { EmptyState } from "@/shared/ui/feedback/empty-state";
import { PageHeading } from "@/shared/ui/layout/page-heading";

export default async function NewGiftPage() {
  const categories = await listGiftCategoriesQuery();

  return (
    <div className="flex w-full flex-col gap-6">
      <PageHeading title="Novo presente" description="Cadastre um presente ou uma experiência para a lista." align="start" />
      {categories.length === 0 ? (
        <EmptyState title="Crie uma categoria primeiro" description="Todo presente precisa de uma categoria." />
      ) : (
        <GiftForm categories={categories} />
      )}
    </div>
  );
}
