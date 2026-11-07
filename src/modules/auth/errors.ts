export class UnauthenticatedError extends Error {
  constructor() {
    super("Authentication required");
  }
}

export class ForbiddenError extends Error {
  constructor(message = "Insufficient permissions") {
    super(message);
  }
}

export class ViewerReadOnlyError extends ForbiddenError {
  constructor() {
    super("Viewer sessions are read-only");
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
  if (error instanceof ViewerReadOnlyError) return "Modo visitante: dá para explorar tudo, mas nada pode ser alterado.";
  if (error instanceof ForbiddenError) return "Você não tem permissão para esta ação.";
  if (error instanceof InvalidGuestCodeError) return "Código inválido.";
  if (error instanceof TooManyLoginAttemptsError) {
    return "Muitas tentativas. Tente novamente em alguns minutos.";
  }
  return null;
}
