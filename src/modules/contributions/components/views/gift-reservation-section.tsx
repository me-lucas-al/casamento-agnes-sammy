import { CancelReservationButton } from "@/modules/contributions/components/cancel-reservation-button";
import { ReserveGiftForm } from "@/modules/contributions/components/reserve-gift-form";
import type { Contribution, GiftReservationView } from "@/modules/contributions/types";
import { PixPaymentPanel } from "@/modules/payments/components/pix-payment-panel";
import type { PixPaymentDetails } from "@/modules/payments/types";
import { formatDateTimeInSaoPaulo } from "@/shared/lib/dates/dates";
import { StaffPreviewNotice } from "@/shared/ui/feedback/staff-preview-notice";

type GiftReservationSectionProps = {
  view: GiftReservationView;
  reservation: Contribution | null;
  payment: PixPaymentDetails | null;
  isStaff: boolean;
  isPixConfigured: boolean;
};

export function GiftReservationSection({
  view,
  reservation,
  payment,
  isStaff,
  isPixConfigured,
}: GiftReservationSectionProps) {
  const { gift, availability } = view;
  if (isStaff) return <StaffPreviewNotice />;
  if (reservation) {
    return (
      <>
        {payment ? <PixPaymentPanel payment={payment} /> : null}
        <p className="text-sm">
          Após o pagamento, os noivos confirmam e o presente fica registrado. Reserva válida até{" "}
          {formatDateTimeInSaoPaulo(reservation.expiresAt)}.
        </p>
        <ReserveGiftForm
          gift={gift}
          contributionId={reservation.id}
          initialAnonymous={reservation.anonymous}
          initialQuotas={reservation.quotas ?? 1}
          initialAmountCents={reservation.amountCents}
          remainingQuotas={(availability.remainingQuotas ?? 0) + (reservation.quotas ?? 0)}
          remainingAmountCents={availability.remainingAmountCents + reservation.amountCents}
        />
        <CancelReservationButton contributionId={reservation.id} />
      </>
    );
  }
  if (availability.isComplete) return null;
  if (!isPixConfigured) {
    return (
      <p role="status" className="rounded-xl bg-blush px-4 py-3 text-base">
        Os noivos ainda estão configurando o Pix. Volte em breve.
      </p>
    );
  }
  return (
    <ReserveGiftForm
      gift={gift}
      remainingQuotas={availability.remainingQuotas ?? 0}
      remainingAmountCents={availability.remainingAmountCents}
    />
  );
}
