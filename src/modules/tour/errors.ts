import { describeAuthError } from "@/modules/auth/errors";

export class TourUserNotFoundError extends Error {
  constructor() {
    super("Tour user not found");
  }
}

export function describeTourError(error: unknown): string {
  if (error instanceof TourUserNotFoundError) return "Não encontramos o seu usuário.";
  return describeAuthError(error) ?? "Não foi possível salvar o tour agora.";
}
