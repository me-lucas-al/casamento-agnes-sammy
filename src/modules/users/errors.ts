import { describeAuthError } from "@/modules/auth/errors";

export class EmailAlreadyRegisteredError extends Error {
  constructor() {
    super("Email already registered");
  }
}

export function describeUserError(error: unknown): string {
  if (error instanceof EmailAlreadyRegisteredError) return "Este e-mail já está cadastrado.";
  return describeAuthError(error) ?? "Não foi possível concluir a operação.";
}
