"use client";

import { useFormStatus } from "react-dom";
import { signInAsViewerAction } from "@/modules/auth/controllers/actions/sign-in.actions";

const CHOICES = [
  { area: "convidado", label: "Ver como convidado" },
  { area: "noivos", label: "Ver como noivos" },
] as const;

function ViewerChoiceButtons() {
  const { pending } = useFormStatus();
  return (
    <div className="grid grid-cols-2 gap-2">
      {CHOICES.map(({ area, label }) => (
        <button
          key={area}
          type="submit"
          name="area"
          value={area}
          disabled={pending}
          aria-busy={pending}
          className="rounded-full border border-rose px-3 py-2 text-base font-semibold text-wine transition-colors hover:bg-blush disabled:opacity-70"
        >
          {pending ? "Abrindo..." : label}
        </button>
      ))}
    </div>
  );
}

export function ViewerEntryButton() {
  return (
    <form action={signInAsViewerAction} className="flex flex-col gap-2 text-center">
      <p className="text-base font-semibold text-wine">Só quero conhecer o site</p>
      <ViewerChoiceButtons />
      <p className="text-sm text-muted-foreground">
        Modo visitante: dá para ver tudo, só não dá para alterar nada. Dados pessoais aparecem mascarados.
      </p>
    </form>
  );
}
