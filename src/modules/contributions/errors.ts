import { describeAuthError } from "@/modules/auth/errors";
import { formatCentsAsBrl } from "@/shared/lib/money";

export class GiftUnavailableError extends Error {
  constructor() {
    super("Gift unavailable");
  }
}

export class GiftNotFoundError extends Error {
  constructor() {
    super("Gift not found");
  }
}

export class InvalidAmountError extends Error {
  constructor(
    readonly minimumCents: number,
    readonly maximumCents: number,
  ) {
    super("Invalid amount");
  }
}

export class InvalidQuotasError extends Error {
  constructor(readonly maximumQuotas: number) {
    super("Invalid quotas");
  }
}

export class ContributionNotFoundError extends Error {
  constructor() {
    super("Contribution not found");
  }
}

export class ContributionNotPendingError extends Error {
  constructor() {
    super("Contribution is not pending");
  }
}

export class TooManyActiveReservationsError extends Error {
  constructor(readonly maximum: number) {
    super("Too many active reservations");
  }
}

export function describeContributionError(error: unknown): string {
  if (error instanceof TooManyActiveReservationsError) {
    return `Você já possui ${error.maximum} reservas pendentes. Conclua ou cancele uma antes de reservar outro presente.`;
  }
  if (error instanceof GiftUnavailableError) return "Este presente não está mais disponível.";
  if (error instanceof GiftNotFoundError) return "Presente não encontrado.";
  if (error instanceof InvalidQuotasError) {
    return `Quantidade de cotas inválida. Restam ${error.maximumQuotas}.`;
  }
  if (error instanceof InvalidAmountError) {
    const range = `${formatCentsAsBrl(error.minimumCents)} a ${formatCentsAsBrl(error.maximumCents)}`;
    return `Valor inválido. Informe um valor entre ${range}.`;
  }
  if (error instanceof ContributionNotFoundError) return "Contribuição não encontrada.";
  if (error instanceof ContributionNotPendingError) return "Esta reserva não está mais pendente.";
  return describeAuthError(error) ?? "Não foi possível concluir a operação.";
}
