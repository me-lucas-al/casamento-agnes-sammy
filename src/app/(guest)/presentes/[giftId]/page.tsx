import Image from "next/image";
import { notFound } from "next/navigation";
import {
  getGiftAvailabilityQuery,
  getPaymentScreenQuery,
} from "@/modules/contributions/controllers/contributions.queries";
import { ReserveGiftForm } from "@/modules/contributions/components/reserve-gift-form";
import { CancelReservationButton } from "@/modules/contributions/components/cancel-reservation-button";
import { GiftNotFoundError } from "@/modules/contributions/errors";
import { describeAvailability } from "@/modules/contributions/lib/describe-availability";
import { PixPaymentPanel } from "@/modules/payments/components/pix-payment-panel";
import { describePaymentError } from "@/modules/payments/errors";
import { formatDateTimeInSaoPaulo } from "@/shared/lib/dates";
import { formatCentsAsBrl } from "@/shared/lib/money";
import { firstValue, type SearchParams } from "@/shared/lib/url-params";

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
  const view = await loadGiftView(giftId);
  const paymentResult = await loadPaymentScreen(contributionId);
  const { gift, availability } = view;
  const reservation = paymentResult?.screen?.contribution;

  return (
    <div className="mx-auto flex max-w-xl flex-col gap-6 text-wine">
      {gift.imageUrl ? (
        <Image
          src={gift.imageUrl}
          alt={gift.name}
          width={640}
          height={480}
          unoptimized
          className="aspect-4/3 w-full rounded-2xl object-cover"
        />
      ) : null}
      <header className="flex flex-col gap-2">
        <h1 className="font-heading text-3xl italic">{gift.name}</h1>
        <p className="text-sm">{gift.description}</p>
        <p className="font-display text-xl">{formatCentsAsBrl(gift.priceCents)}</p>
        <p className="w-fit rounded-full bg-blush px-3 py-1 text-sm">{describeAvailability(view)}</p>
      </header>
      {paymentResult?.errorMessage ? (
        <p role="alert" className="text-sm text-crimson">{paymentResult.errorMessage}</p>
      ) : null}
      {reservation && paymentResult?.screen ? (
        <>
          <PixPaymentPanel payment={paymentResult.screen.payment} />
          <p className="text-sm">
            Após o pagamento, os noivos confirmam e o presente fica registrado. Reserva válida até{" "}
            {formatDateTimeInSaoPaulo(reservation.expiresAt)}.
          </p>
          <ReserveGiftForm
            gift={gift}
            contributionId={reservation.id}
            initialAnonymous={reservation.anonymous}
            remainingQuotas={(availability.remainingQuotas ?? 0) + (reservation.quotas ?? 0)}
            remainingAmountCents={availability.remainingAmountCents + reservation.amountCents}
          />
          <CancelReservationButton contributionId={reservation.id} />
        </>
      ) : null}
      {!reservation && !availability.isComplete ? (
        <ReserveGiftForm
          gift={gift}
          remainingQuotas={availability.remainingQuotas ?? 0}
          remainingAmountCents={availability.remainingAmountCents}
        />
      ) : null}
    </div>
  );
}
