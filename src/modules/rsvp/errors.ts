import { describeAuthError } from "@/modules/auth/errors";

export class RsvpDeadlinePassedError extends Error {
  constructor() {
    super("RSVP deadline has passed");
  }
}

export class CompanionLimitExceededError extends Error {
  constructor() {
    super("Companions exceed available seats");
  }
}

export class RsvpAlreadyAnsweredError extends Error {
  constructor() {
    super("RSVP already answered");
  }
}

export class RsvpGuestNotFoundError extends Error {
  constructor() {
    super("Guest not found");
  }
}

export function describeRsvpError(error: unknown): string {
  if (error instanceof RsvpDeadlinePassedError) return "O prazo para confirmar presença já passou.";
  if (error instanceof CompanionLimitExceededError) {
    return "O número de acompanhantes excede as vagas do seu convite.";
  }
  if (error instanceof RsvpAlreadyAnsweredError) {
    return "Sua resposta já foi enviada. Fale com os noivos para alterá-la.";
  }
  if (error instanceof RsvpGuestNotFoundError) return "Convidado não encontrado.";
  return describeAuthError(error) ?? "Não foi possível concluir a operação.";
}
