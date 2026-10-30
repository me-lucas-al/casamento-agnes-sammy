"use client";

import { CenteredStage } from "@/shared/ui/components/centered-stage";

type ErrorPageProps = { error: Error & { digest?: string }; reset: () => void };

export default function ErrorPage({ reset }: ErrorPageProps) {
  return (
    <CenteredStage>
      <h1 className="font-script text-4xl leading-tight text-wine">Ops, algo deu errado</h1>
      <p className="text-lg">Não conseguimos carregar esta página agora. Tente de novo em instantes.</p>
      <button
        type="button"
        onClick={reset}
        className="rounded-full bg-rose px-6 py-3 text-lg text-white transition-colors hover:bg-crimson"
      >
        Tentar novamente
      </button>
    </CenteredStage>
  );
}
