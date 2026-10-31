import { Gift } from "lucide-react";
import Link from "next/link";
import { getSuggestionsPromptStatusQuery } from "../controllers/suggestions.queries";

const SUGGESTIONS_HREF = "/painel/presentes/sugestoes";

export async function SuggestionsHomeCard() {
  const { shouldPromote } = await getSuggestionsPromptStatusQuery();
  if (!shouldPromote) {
    return (
      <Link
        href={SUGGESTIONS_HREF}
        className="inline-flex min-h-11 w-fit items-center gap-2 rounded-full border border-gold bg-card px-5 text-base font-semibold text-wine hover:bg-blush"
      >
        <Gift aria-hidden className="size-4" />
        Ver sugestões
      </Link>
    );
  }
  return (
    <section
      aria-labelledby="suggestions-card-title"
      className="flex flex-col gap-3 rounded-2xl border border-gold bg-blush p-4 sm:flex-row sm:items-center sm:justify-between sm:p-6"
    >
      <div className="flex flex-col gap-1">
        <h2 id="suggestions-card-title" className="font-heading text-2xl italic text-wine">
          Sugestões de presentes
        </h2>
        <p className="max-w-prose text-base">
          Sua lista ainda está pequena. Escolham entre mais de 250 ideias de casa, lua de mel e diversão, e adicionem com um toque.
        </p>
      </div>
      <Link
        href={SUGGESTIONS_HREF}
        className="inline-flex min-h-11 w-fit shrink-0 items-center justify-center gap-2 rounded-full bg-crimson px-6 text-base font-semibold text-paper hover:bg-wine"
      >
        <Gift aria-hidden className="size-4" />
        Ver sugestões
      </Link>
    </section>
  );
}
