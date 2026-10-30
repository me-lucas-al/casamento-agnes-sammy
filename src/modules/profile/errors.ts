import { describeAuthError } from "@/modules/auth/errors";
import { CompanionLimitExceededError } from "@/modules/rsvp/errors";

export class ProfileNotFoundError extends Error {
  constructor() {
    super("Profile not found");
  }
}

export function describeProfileError(error: unknown): string {
  if (error instanceof ProfileNotFoundError) return "Perfil não encontrado.";
  if (error instanceof CompanionLimitExceededError) return "Há mais familiares do que vagas no seu convite.";
  return describeAuthError(error) ?? "Não foi possível carregar o perfil.";
}
