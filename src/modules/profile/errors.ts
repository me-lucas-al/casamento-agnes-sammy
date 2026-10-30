import { describeAuthError } from "@/modules/auth/errors";
import { CompanionLimitExceededError, RsvpDeadlinePassedError } from "@/modules/rsvp/errors";

export class ProfileNotFoundError extends Error {
  constructor() {
    super("Profile not found");
  }
}

export function describeProfileError(error: unknown): string {
  if (error instanceof ProfileNotFoundError) return "Perfil não encontrado.";
  if (error instanceof CompanionLimitExceededError) return "Há mais familiares do que vagas no seu convite.";
  if (error instanceof RsvpDeadlinePassedError) return "O prazo para alterar familiares já passou. Fale com os noivos.";
  return describeAuthError(error) ?? "Não foi possível carregar o perfil.";
}
