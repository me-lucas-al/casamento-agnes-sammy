import Link from "next/link";
import type { OnboardingStatus } from "../types";

type OnboardingCardProps = { status: OnboardingStatus };

export function OnboardingCard({ status }: OnboardingCardProps) {
  if (status.isComplete) return null;
  const progressPercent = Math.round((status.doneCount / status.steps.length) * 100);
  return (
    <section
      aria-labelledby="onboarding-title"
      className="flex flex-col gap-4 rounded-2xl border border-gold/50 bg-card p-4 sm:p-6"
    >
      <div className="flex flex-col gap-1">
        <h2 id="onboarding-title" className="font-serif text-2xl italic text-wine">
          Primeiros passos
        </h2>
        <p className="text-base">
          {status.doneCount} de {status.steps.length} passos concluídos. Siga a lista para deixar o site pronto.
        </p>
        <div
          role="progressbar"
          aria-label="Progresso dos primeiros passos"
          aria-valuemin={0}
          aria-valuemax={100}
          aria-valuenow={progressPercent}
          className="mt-2 h-2 w-full overflow-hidden rounded-full bg-blush"
        >
          <div className="h-full bg-rose" style={{ width: `${progressPercent}%` }} />
        </div>
      </div>
      <ol className="flex flex-col gap-3">
        {status.steps.map((step, index) => (
          <li key={step.key}>
            <Link
              href={step.href}
              className="flex min-h-11 items-start gap-3 rounded-xl border border-gold/30 px-3 py-3 transition-colors hover:bg-blush focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-wine"
            >
              <span
                aria-hidden="true"
                className={`mt-0.5 flex size-6 shrink-0 items-center justify-center rounded-full text-sm ${
                  step.isDone ? "bg-rose text-white" : "border border-wine/40 text-wine"
                }`}
              >
                {step.isDone ? "✓" : index + 1}
              </span>
              <span className="flex flex-col">
                <span className="text-base font-semibold text-wine">
                  {step.title}
                  <span className="sr-only">{step.isDone ? " (concluído)" : " (pendente)"}</span>
                </span>
                <span className="text-base">{step.description}</span>
              </span>
            </Link>
          </li>
        ))}
      </ol>
    </section>
  );
}
