import Link from "next/link";
import type { AddFeedback } from "@/modules/gift-suggestions/hooks/use-suggestion-adding";

export function AddFeedbackMessage({ feedback }: { feedback: AddFeedback | null }) {
  if (!feedback) return null;
  if (feedback.kind === "error") {
    return (
      <p role="alert" className="rounded-2xl border border-crimson/40 bg-white px-4 py-3 text-base text-crimson">
        {feedback.message}
      </p>
    );
  }
  const created = feedback.createdCount === 1 ? "1 presente adicionado" : `${feedback.createdCount} presentes adicionados`;
  const skipped = feedback.skippedCount > 0 ? ` (${feedback.skippedCount} já estavam na lista)` : "";
  const failed = feedback.failedCount > 0 ? ` Não foi possível adicionar ${feedback.failedCount}. Tente novamente.` : "";
  return (
    <div role="status" className="flex flex-col gap-1 rounded-2xl border border-gold bg-blush px-4 py-3 text-base text-wine">
      <p className="font-semibold">{created}{skipped}.{failed}</p>
      <p>
        Vocês podem ajustar preço, foto e visibilidade de cada um em{" "}
        <Link href="/painel/presentes" className="font-semibold underline underline-offset-4">
          Presentes
        </Link>
        .
      </p>
    </div>
  );
}
