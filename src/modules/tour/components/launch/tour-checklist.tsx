"use client";

import { Check } from "lucide-react";
import Link from "next/link";
import { useEffect, useState } from "react";
import type { OnboardingStatus } from "@/modules/dashboard/types";
import { cn } from "@/shared/lib/styling/utils";
import { loadTourChecklistAction } from "@/modules/tour/controllers/actions/tour.actions";
import { useTourControls } from "../dialog/tour-controls";

type ChecklistState = { phase: "loading" } | { phase: "failed" } | { phase: "ready"; status: OnboardingStatus };

export function TourChecklist() {
  const { closeTour } = useTourControls();
  const [state, setState] = useState<ChecklistState>({ phase: "loading" });

  useEffect(() => {
    let isCurrent = true;
    loadTourChecklistAction().then((result) => {
      if (!isCurrent) return;
      setState(result.ok ? { phase: "ready", status: result.data } : { phase: "failed" });
    });
    return () => {
      isCurrent = false;
    };
  }, []);

  if (state.phase === "loading") return <p aria-live="polite" className="text-lg">Conferindo o que já está pronto...</p>;
  if (state.phase === "failed") return <p className="text-lg">Não conseguimos carregar a lista agora. Vocês a encontram na tela inicial do painel.</p>;
  if (state.status.isComplete) return <p className="rounded-2xl bg-blush px-4 py-3 text-lg">Tudo preenchido! O site de vocês está pronto para receber os convidados.</p>;
  return (
    <ol className="flex flex-col gap-2">
      {state.status.steps.map((step) => (
        <li key={step.key}>
          <Link
            href={step.href}
            onClick={closeTour}
            className="flex min-h-11 items-start gap-3 rounded-xl border border-gold/50 bg-card px-3 py-2 transition-colors hover:bg-blush"
          >
            <span
              aria-hidden
              className={cn(
                "mt-0.5 flex size-6 shrink-0 items-center justify-center rounded-full border",
                step.isDone ? "border-rose bg-rose text-white" : "border-wine/40",
              )}
            >
              {step.isDone ? <Check className="size-4" /> : null}
            </span>
            <span className="flex flex-col text-base leading-snug">
              <span className="font-semibold">
                {step.title}
                <span className="sr-only">{step.isDone ? " (concluído)" : " (pendente)"}</span>
              </span>
              <span>{step.description}</span>
            </span>
          </Link>
        </li>
      ))}
    </ol>
  );
}
