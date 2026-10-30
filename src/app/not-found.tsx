import Link from "next/link";

export default function NotFound() {
  return (
    <main className="mx-auto flex min-h-screen w-full max-w-md flex-col items-center justify-center gap-4 px-6 text-center">
      <p className="font-display text-6xl text-rose">404</p>
      <h1 className="font-heading text-3xl italic">Página não encontrada</h1>
      <p className="text-lg">O endereço que você procura não existe ou foi movido.</p>
      <Link href="/" className="rounded-full bg-rose px-6 py-3 text-lg text-white transition-colors hover:bg-crimson">
        Voltar ao início
      </Link>
    </main>
  );
}
