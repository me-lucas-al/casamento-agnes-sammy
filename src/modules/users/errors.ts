import { describeAuthError } from "@/modules/auth/errors";

export class EmailAlreadyRegisteredError extends Error {
  constructor() {
    super("Email already registered");
  }
}

export class UserNotFoundError extends Error {
  constructor() {
    super("User not found");
  }
}

export class CannotDeactivateSelfError extends Error {
  constructor() {
    super("Cannot deactivate yourself");
  }
}

export class LastAdminError extends Error {
  constructor() {
    super("Cannot deactivate the last admin");
  }
}

export function describeUserError(error: unknown): string {
  if (error instanceof EmailAlreadyRegisteredError) return "Este e-mail já está cadastrado.";
  if (error instanceof UserNotFoundError) return "Usuário não encontrado.";
  if (error instanceof CannotDeactivateSelfError) return "Você não pode desativar a si mesmo.";
  if (error instanceof LastAdminError) return "Não é possível desativar o último administrador.";
  return describeAuthError(error) ?? "Não foi possível concluir a operação.";
}
