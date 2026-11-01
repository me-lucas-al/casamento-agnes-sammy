import { ArrowLeft } from "lucide-react";
import Link from "next/link";
import { notFound } from "next/navigation";
import { getSessionUser } from "@/modules/auth/controllers/session/get-session-user";
import {
  getGiftAvailabilityQuery,
  getPaymentScreenQuery,
  isPixConfiguredQuery,
} from "@/modules/contributions/controllers/queries/contributions.queries";
import { GiftReservationSection } from "@/modules/contributions/components/views/gift-reservation-section";
import { GiftNotFoundError } from "@/modules/contributions/errors";
import { describeAvailability } from "@/modules/contributions/lib/availability/describe-availability";
import { StoreBadge } from "@/modules/gifts/components/cards/store-badge";
import { StoreLink } from "@/modules/gifts/components/cards/store-link";
import { describePaymentError } from "@/modules/payments/errors";
import { formatCentsAsBrl } from "@/shared/lib/money/money";
import { firstValue, type SearchParams } from "@/shared/lib/url/url-params";
import { ProductImage } from "@/shared/ui/media/product-image";

type PageProps = {
  params: Promise<{ giftId: string }>;
  searchParams: Promise<SearchParams>;
};

async function loadGiftView(giftId: string) {
  try {
    return await getGiftAvailabilityQuery(giftId);
  } catch (error) {
    if (error instanceof GiftNotFoundError) notFound();
    throw error;
  }
}

async function loadPaymentScreen(contributionId: string | undefined) {
  if (!contributionId) return null;
  try {
    return { screen: await getPaymentScreenQuery(contributionId), errorMessage: null };
  } catch (error) {
    return { screen: null, errorMessage: describePaymentError(error) };
  }
}

export default async function GiftDetailPage({ params, searchParams }: PageProps) {
  const { giftId } = await params;
  const contributionId = firstValue((await searchParams).reserva);
  const actor = await getSessionUser();
  const [view, isPixConfigured, paymentResult] = await Promise.all([
    loadGiftView(giftId),
    isPixConfiguredQuery(),
    loadPaymentScreen(actor?.role === "guest" ? contributionId : undefined),
  ]);
  const { gift } = view;
  const screen = paymentResult?.screen ?? null;

  return (
    <div className="mx-auto flex max-w-xl flex-col gap-6 text-wine">
      <Link href="/presentes" className="inline-flex min-h-11 w-fit items-center gap-1.5 text-base underline-offset-4 hover:underline">
        <ArrowLeft aria-hidden className="size-4" />
        Voltar aos presentes
      </Link>
      <ProductImage src={gift.imageUrl} alt={gift.name} sizes="(min-width: 576px) 576px, 100vw" priority className="rounded-2xl" />
      <header className="flex flex-col gap-2">
        <h1 className="font-heading text-3xl italic">{gift.name}</h1>
        <p className="text-base">{gift.description}</p>
        <p className="font-display text-xl">{formatCentsAsBrl(gift.priceCents)}</p>
        <p className="w-fit rounded-full bg-blush px-3 py-1 text-base">{describeAvailability(view)}</p>
        {gift.productUrl ? (
          <div className="flex flex-wrap items-center gap-3">
            <StoreBadge storeName={gift.storeName} />
            <StoreLink productUrl={gift.productUrl} />
          </div>
        ) : null}
      </header>
      {paymentResult?.errorMessage ? (
        <p role="alert" className="text-sm text-crimson">{paymentResult.errorMessage}</p>
      ) : null}
      {screen?.paymentErrorMessage ? (
        <p role="alert" className="text-sm text-crimson">{screen.paymentErrorMessage}</p>
      ) : null}
      <GiftReservationSection
        view={view}
        reservation={screen?.contribution ?? null}
        payment={screen?.payment ?? null}
        isStaff={actor?.role !== "guest"}
        isPixConfigured={isPixConfigured}
      />
    </div>
  );
}
