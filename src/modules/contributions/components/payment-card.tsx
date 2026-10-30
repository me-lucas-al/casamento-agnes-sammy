import { formatDateTimeInSaoPaulo } from "@/shared/lib/dates";
import { formatCentsAsBrl } from "@/shared/lib/money";
import { CONTRIBUTION_STATUS_LABELS } from "../lib/describe-availability";
import type { PendingPaymentRow } from "../types";
import { PaymentRowActions } from "./payment-row-actions";

type PaymentCardProps = {
  payment: PendingPaymentRow;
};

export function PaymentCard({ payment }: PaymentCardProps) {
  return (
    <li className="flex flex-col gap-3 rounded-2xl border bg-paper p-4 text-wine">
      <div className="flex flex-wrap items-start justify-between gap-2">
        <div className="min-w-0">
          <h2 className="font-serif text-lg">{payment.giftName}</h2>
          <p className="text-sm">{payment.guestName}</p>
        </div>
        <span className="rounded-full bg-blush px-3 py-1 text-xs">
          {CONTRIBUTION_STATUS_LABELS[payment.status]}
        </span>
      </div>
      <p className="text-sm">
        {formatCentsAsBrl(payment.amountCents)}
        {payment.quotas ? ` · ${payment.quotas} cota(s)` : ""} · criado em{" "}
        {formatDateTimeInSaoPaulo(payment.createdAt)}
      </p>
      {payment.status === "reserved" ? (
        <p className="text-xs">Expira em {formatDateTimeInSaoPaulo(payment.expiresAt)}</p>
      ) : null}
      <PaymentRowActions contributionId={payment.id} status={payment.status} />
    </li>
  );
}
