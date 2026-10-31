"use client";

import { useFormStatus } from "react-dom";
import { signInWithGoogleAction } from "../../controllers/sign-in.actions";
import { GoogleMark } from "./google-mark";

function GoogleButtonFace() {
  const { pending } = useFormStatus();
  return (
    <button
      type="submit"
      disabled={pending}
      aria-busy={pending}
      className="flex w-full items-center justify-center gap-3 rounded-full border border-input bg-white px-6 py-3 text-lg font-semibold text-wine shadow-sm transition-colors hover:bg-blush disabled:opacity-70"
    >
      <GoogleMark />
      {pending ? "Abrindo o Google..." : "Entrar com Google"}
    </button>
  );
}

export function GoogleSignInButton() {
  return (
    <form action={signInWithGoogleAction} className="flex flex-col gap-3">
      <GoogleButtonFace />
      <p className="text-base text-muted-foreground">Só entram os e-mails cadastrados pelos noivos.</p>
    </form>
  );
}
