import { describeAuthError } from "@/modules/auth/errors";

export class ProfileNotFoundError extends Error {
  constructor() {
    super("Profile not found");
  }
}

export function describeProfileError(error: unknown): string {
  if (error instanceof ProfileNotFoundError) return "Perfil não encontrado.";
  return describeAuthError(error) ?? "Não foi possível carregar o perfil.";
}
