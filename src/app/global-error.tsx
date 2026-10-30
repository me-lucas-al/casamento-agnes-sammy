"use client";

import { fontVariableClassNames } from "@/shared/theme/fonts";
import { RetryButton } from "@/shared/ui/components/retry-button";
import "./globals.css";

type GlobalErrorProps = { error: Error & { digest?: string }; reset: () => void };

export default function GlobalError({ reset }: GlobalErrorProps) {
  return (
    <html lang="pt-BR" className={`${fontVariableClassNames} h-full antialiased`}>
      <body className="flex min-h-full flex-col items-center justify-center gap-4 bg-paper px-6 text-center text-wine">
        <h1 className="font-script text-5xl leading-tight">Ops, algo deu errado</h1>
        <p className="max-w-sm text-lg">Não conseguimos carregar o site agora. Tente de novo em instantes.</p>
        <RetryButton onRetry={reset} />
      </body>
    </html>
  );
}
