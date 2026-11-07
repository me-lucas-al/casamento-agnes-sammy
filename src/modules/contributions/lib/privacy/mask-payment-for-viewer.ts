import { maskPersonName } from "@/shared/lib/privacy/mask-person-name";
import type { PendingPaymentRow } from "../../types";

export function maskPaymentForViewer(payment: PendingPaymentRow): PendingPaymentRow {
  return { ...payment, guestName: maskPersonName(payment.guestName) };
}
