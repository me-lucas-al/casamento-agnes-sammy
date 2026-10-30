import { formatCentsAsBrl } from "@/shared/lib/money";
import type { ContributionStatus, GiftReservationView } from "../types";

export const CONTRIBUTION_STATUS_LABELS: Record<ContributionStatus, string> = {
  reserved: "Aguardando pagamento",
  confirmed: "Confirmado",
  cancelled: "Cancelado",
  expired: "Expirado",
};

export function describeAvailability({ gift, availability }: GiftReservationView): string {
  if (availability.isComplete) return "Presente completo";
  if (gift.mode === "fixed_quotas") {
    return `${availability.remainingQuotas} de ${gift.totalQuotas} cotas disponíveis`;
  }
  if (gift.mode === "free_amount") {
    return `Faltam ${formatCentsAsBrl(availability.remainingAmountCents)}`;
  }
  return "Disponível";
}
