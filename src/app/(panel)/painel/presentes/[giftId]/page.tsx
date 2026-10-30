import { notFound } from "next/navigation";
import { GiftForm } from "@/modules/gifts/components/gift-form";
import { getGiftForEditQuery, listGiftCategoriesQuery } from "@/modules/gifts/controllers/gifts.queries";
import { GiftNotFoundError } from "@/modules/gifts/errors";
import { giftIdSchema } from "@/modules/gifts/schemas/gift.schema";

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
      <h1 className="font-serif text-2xl italic text-wine">Editar presente</h1>
      <GiftForm categories={categories} gift={gift} />
    </div>
  );
}
