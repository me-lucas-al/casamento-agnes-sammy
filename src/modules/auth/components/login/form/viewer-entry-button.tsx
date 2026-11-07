"use client";

import { useFormStatus } from "react-dom";
import { signInAsViewerAction } from "@/modules/auth/controllers/actions/sign-in.actions";

function ViewerButtonFace() {
  const { pending } = useFormStatus();
  return (
    <button
      type="submit"
      disabled={pending}
      aria-busy={pending}
      className="w-full rounded-full px-4 py-2 text-base font-semibold text-wine underline-offset-4 transition-colors hover:underline disabled:opacity-70"
    >
      {pending ? "Abrindo o site..." : "Só quero conhecer o site"}
    </button>
  );
}

export function ViewerEntryButton() {
  return (
    <form action={signInAsViewerAction} className="flex flex-col items-center gap-1 text-center">
      <ViewerButtonFace />
      <p className="text-sm text-muted-foreground">
        Modo visitante: dá para ver tudo, só não dá para alterar nada. Dados pessoais aparecem mascarados.
      </p>
    </form>
  );
}
