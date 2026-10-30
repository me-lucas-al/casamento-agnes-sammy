"use client";

type ErrorPageProps = { error: Error & { digest?: string }; reset: () => void };

export default function ErrorPage({ reset }: ErrorPageProps) {
  return (
    <main className="mx-auto flex min-h-screen w-full max-w-md flex-col items-center justify-center gap-4 px-6 text-center">
      <h1 className="font-heading text-3xl italic">Algo deu errado</h1>
      <p className="text-lg">Não foi possível carregar esta página. Tente novamente em instantes.</p>
      <button
        type="button"
        onClick={reset}
        className="rounded-full bg-rose px-6 py-3 text-lg text-white transition-colors hover:bg-crimson"
      >
        Tentar novamente
      </button>
    </main>
  );
}
