"use client";

import { CenteredStage } from "@/shared/ui/layout/centered-stage";
import { RetryButton } from "@/shared/ui/feedback/retry-button";

type ErrorPageProps = { error: Error & { digest?: string }; reset: () => void };

export default function ErrorPage({ reset }: ErrorPageProps) {
  return (
    <CenteredStage>
      <h1 className="font-script text-4xl leading-tight text-wine">Ops, algo deu errado</h1>
      <p className="text-lg">Não conseguimos carregar esta página agora. Tente de novo em instantes.</p>
      <RetryButton onRetry={reset} />
    </CenteredStage>
  );
}
