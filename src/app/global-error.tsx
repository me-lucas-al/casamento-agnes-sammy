"use client";

import { FloralCorners } from "@/shared/ui/layout/floral-corners";
import { fontVariableClassNames } from "@/shared/theme/fonts";
import { RetryButton } from "@/shared/ui/feedback/retry-button";
import "./globals.css";

type GlobalErrorProps = { error: Error & { digest?: string }; reset: () => void };

export default function GlobalError({ reset }: GlobalErrorProps) {
  return (
    <html lang="pt-BR" className={`${fontVariableClassNames} antialiased`}>
      <body className="relative flex min-h-dvh flex-col items-center justify-center gap-4 bg-paper px-6 text-center text-wine">
        <FloralCorners area="top" className="w-24 sm:w-40" />
        <h1 className="relative font-script text-5xl leading-tight">Ops, algo deu errado</h1>
        <p className="relative max-w-sm text-lg">Não conseguimos carregar o site agora. Tente de novo em instantes.</p>
        <RetryButton onRetry={reset} />
      </body>
    </html>
  );
}
