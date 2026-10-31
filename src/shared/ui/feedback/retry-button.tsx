"use client";

type RetryButtonProps = { onRetry: () => void };

export function RetryButton({ onRetry }: RetryButtonProps) {
  return (
    <button
      type="button"
      onClick={onRetry}
      className="inline-flex min-h-11 items-center justify-center rounded-full bg-rose px-6 py-2 text-lg text-white transition-colors hover:bg-crimson focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-wine"
    >
      Tentar novamente
    </button>
  );
}
