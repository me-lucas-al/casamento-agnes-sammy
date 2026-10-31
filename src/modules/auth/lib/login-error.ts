import { enumParam, type SearchParams } from "@/shared/lib/url-params";

const LOGIN_ERRORS = [
  "AccessDenied",
  "Configuration",
  "OAuthSignin",
  "OAuthCallbackError",
  "OAuthAccountNotLinked",
  "Callback",
] as const;

export type LoginError = (typeof LOGIN_ERRORS)[number];

const LOGIN_ERROR_MESSAGES: Record<LoginError, string> = {
  AccessDenied: "E-mail não autorizado. Só entram os e-mails cadastrados pelos noivos.",
  Configuration: "Não foi possível entrar com o Google agora. Tente novamente em instantes.",
  OAuthSignin: "Não foi possível entrar com o Google agora. Tente novamente em instantes.",
  OAuthCallbackError: "Não foi possível entrar com o Google agora. Tente novamente em instantes.",
  OAuthAccountNotLinked: "Este e-mail já está associado a outra forma de entrada.",
  Callback: "Não foi possível entrar com o Google agora. Tente novamente em instantes.",
};

export function parseLoginError(searchParams: SearchParams): LoginError | undefined {
  return enumParam(searchParams, "error", LOGIN_ERRORS);
}

export function describeLoginError(loginError: LoginError | undefined): string | null {
  return loginError ? LOGIN_ERROR_MESSAGES[loginError] : null;
}
