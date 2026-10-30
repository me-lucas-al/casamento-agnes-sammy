import { describeAuthError } from "@/modules/auth/errors";

export class InvalidPixKeyError extends Error {
  constructor() {
    super("Invalid pix key for the selected type");
  }
}

export function describeEventError(error: unknown): string {
  if (error instanceof InvalidPixKeyError) return "A chave Pix não confere com o tipo selecionado.";
  return describeAuthError(error) ?? "Não foi possível salvar as configurações.";
}
