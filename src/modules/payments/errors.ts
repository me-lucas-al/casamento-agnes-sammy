import { describeAuthError } from "@/modules/auth/errors";

export class InvalidPixAmountError extends Error {
  constructor() {
    super("Invalid pix amount");
  }
}

export class InvalidPixFieldError extends Error {
  constructor(readonly fieldName: string) {
    super(`Invalid pix field: ${fieldName}`);
  }
}

export class PixNotConfiguredError extends Error {
  constructor() {
    super("Pix is not configured");
  }
}

export function describePaymentError(error: unknown): string {
  if (error instanceof PixNotConfiguredError) return "A chave Pix ainda não foi configurada pelos noivos.";
  if (error instanceof InvalidPixAmountError) return "Valor inválido para o Pix.";
  if (error instanceof InvalidPixFieldError) return "Os dados do Pix dos noivos estão incompletos.";
  return describeAuthError(error) ?? "Não foi possível gerar o pagamento.";
}
