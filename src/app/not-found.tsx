import Link from "next/link";
import { CenteredStage } from "@/shared/ui/layout/centered-stage";

export default function NotFound() {
  return (
    <CenteredStage>
      <p className="font-display text-6xl text-rose-soft">404</p>
      <h1 className="font-script text-4xl leading-tight text-wine">Página não encontrada</h1>
      <p className="text-lg">Esse caminho não leva a lugar nenhum. Que tal voltar para o começo da nossa festa?</p>
      <Link
        href="/"
        className="inline-flex min-h-11 items-center rounded-full bg-rose px-6 py-3 text-lg text-white transition-colors hover:bg-crimson"
      >
        Voltar ao início
      </Link>
    </CenteredStage>
  );
}
