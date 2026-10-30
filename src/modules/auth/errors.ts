export class UnauthenticatedError extends Error {
  constructor() {
    super("Authentication required");
  }
}

export class ForbiddenError extends Error {
  constructor() {
    super("Insufficient permissions");
  }
}

export class InvalidGuestCodeError extends Error {
  constructor() {
    super("Invalid guest code");
  }
}

export class TooManyLoginAttemptsError extends Error {
  constructor() {
    super("Too many login attempts");
  }
}

export function describeAuthError(error: unknown): string | null {
  if (error instanceof UnauthenticatedError) return "Faça login para continuar.";
  if (error instanceof ForbiddenError) return "Você não tem permissão para esta ação.";
  if (error instanceof InvalidGuestCodeError) return "Código inválido.";
  if (error instanceof TooManyLoginAttemptsError) {
    return "Muitas tentativas. Tente novamente em alguns minutos.";
  }
  return null;
}
