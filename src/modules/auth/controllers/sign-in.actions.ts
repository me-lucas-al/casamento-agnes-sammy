"use server";

import { AuthError } from "next-auth";
import { signIn, signOut } from "../config/auth";

export type SignInFormState = { error: string | null };

const GENERIC_GUEST_CODE_ERROR = "Código inválido ou muitas tentativas. Tente novamente mais tarde.";

export async function signInWithGuestCodeAction(
  _previousState: SignInFormState,
  formData: FormData,
): Promise<SignInFormState> {
  const code = String(formData.get("code") ?? "").trim().toUpperCase();
  if (!code) return { error: GENERIC_GUEST_CODE_ERROR };
  try {
    await signIn("guest-code", { code, redirectTo: "/presentes" });
    return { error: null };
  } catch (error) {
    if (error instanceof AuthError) return { error: GENERIC_GUEST_CODE_ERROR };
    throw error;
  }
}

export async function signInWithGoogleAction(): Promise<void> {
  await signIn("google", { redirectTo: "/painel" });
}

export async function signOutAction(): Promise<void> {
  await signOut({ redirectTo: "/" });
}
