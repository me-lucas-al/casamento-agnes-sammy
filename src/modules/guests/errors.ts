import { describeAuthError } from "@/modules/auth/errors";

export class GuestNotFoundError extends Error {
  constructor() {
    super("Guest not found");
  }
}

export class GuestHasConfirmedContributionsError extends Error {
  constructor() {
    super("Guest has confirmed contributions");
  }
}

export class GuestCodeGenerationError extends Error {
  constructor() {
    super("Could not generate a unique guest code");
  }
}

export function describeGuestError(error: unknown): string {
  if (error instanceof GuestNotFoundError) return "Convidado não encontrado.";
  if (error instanceof GuestHasConfirmedContributionsError) {
    return "Este convidado tem contribuições confirmadas e não pode ser excluído.";
  }
  if (error instanceof GuestCodeGenerationError) return "Não foi possível gerar o código. Tente novamente.";
  return describeAuthError(error) ?? "Não foi possível concluir a operação.";
}
