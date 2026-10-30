import { describeAuthError } from "@/modules/auth/errors";

export const MAX_PENDING_MESSAGES_PER_GUEST = 5;

export class InvalidMessageError extends Error {
  constructor() {
    super("Invalid message");
  }
}

export class TooManyPendingMessagesError extends Error {
  constructor() {
    super("Too many pending messages");
  }
}

export class MessageNotFoundError extends Error {
  constructor() {
    super("Message not found");
  }
}

export function describeMessageError(error: unknown): string {
  if (error instanceof InvalidMessageError) return "Escreva um recado de 1 a 500 caracteres.";
  if (error instanceof TooManyPendingMessagesError) {
    return "Você já tem recados aguardando aprovação. Aguarde para enviar outro.";
  }
  if (error instanceof MessageNotFoundError) return "Recado não encontrado.";
  return describeAuthError(error) ?? "Não foi possível concluir a operação.";
}
