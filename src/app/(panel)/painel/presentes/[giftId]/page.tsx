import { notFound } from "next/navigation";
import { GiftForm } from "@/modules/gifts/components/form/gift-form";
import { getGiftForEditQuery, listGiftCategoriesQuery } from "@/modules/gifts/controllers/queries/gifts.queries";
import { GiftNotFoundError } from "@/modules/gifts/errors";
import { giftIdSchema } from "@/modules/gifts/schemas/gift.schema";
import { PageHeading } from "@/shared/ui/layout/page-heading";

type EditGiftPageProps = { params: Promise<{ giftId: string }> };

export default async function EditGiftPage({ params }: EditGiftPageProps) {
  const { giftId } = await params;
  if (!giftIdSchema.safeParse(giftId).success) notFound();
  const gift = await getGiftForEditQuery(giftId).catch((error: unknown) => {
    if (error instanceof GiftNotFoundError) return null;
    throw error;
  });
  if (!gift) notFound();
  const categories = await listGiftCategoriesQuery();

  return (
    <div className="flex w-full flex-col gap-6">
      <PageHeading title="Editar presente" description="Ajuste detalhes, valor e imagem deste presente." align="start" />
      <GiftForm categories={categories} gift={gift} />
    </div>
  );
}
