"use server";

import { AuthError } from "next-auth";
import { logger } from "@/shared/lib/logger";
import { serializeError } from "@/shared/lib/logging/serialize-error";
import { isNextControlFlowError } from "@/shared/lib/next-control-flow";
import { signIn, signOut } from "@/modules/auth/config/auth";
import { normalizeAccessCode } from "@/modules/auth/lib/access-code";

export type SignInFormState = { error: string | null };

const GENERIC_GUEST_CODE_ERROR = "Código inválido ou muitas tentativas. Tente novamente mais tarde.";

export async function signInWithGuestCodeAction(
  _previousState: SignInFormState,
  formData: FormData,
): Promise<SignInFormState> {
  const code = normalizeAccessCode(String(formData.get("code") ?? ""));
  if (!code) return { error: GENERIC_GUEST_CODE_ERROR };
  try {
    await signIn("guest-code", { code, redirectTo: "/inicio" });
    return { error: null };
  } catch (error) {
    if (isNextControlFlowError(error)) throw error;
    if (!(error instanceof AuthError)) {
      logger.error("action.unexpected_error", { action: "signInWithGuestCodeAction", error: serializeError(error) });
    }
    return { error: GENERIC_GUEST_CODE_ERROR };
  }
}

export async function signInWithGoogleAction(): Promise<void> {
  await signIn("google", { redirectTo: "/painel" });
}

export async function signOutAction(): Promise<void> {
  await signOut({ redirectTo: "/" });
}
