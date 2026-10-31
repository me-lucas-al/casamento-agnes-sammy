"use client";

import { RetryButton } from "./retry-button";

type RouteErrorViewProps = { reset: () => void };

export function RouteErrorView({ reset }: RouteErrorViewProps) {
  return (
    <div role="alert" className="mx-auto flex max-w-md flex-col items-center gap-4 py-16 text-center">
      <h1 className="font-script text-4xl leading-tight text-wine">Ops, algo deu errado</h1>
      <p className="text-lg">Não conseguimos carregar esta página agora. Tente de novo em instantes.</p>
      <RetryButton onRetry={reset} />
    </div>
  );
}
