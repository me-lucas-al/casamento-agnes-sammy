import { LoaderCircle } from "lucide-react";
import type { ReactNode } from "react";

type SubmitButtonProps = { isPending: boolean; pendingLabel: string; children: ReactNode };

export function SubmitButton({ isPending, pendingLabel, children }: SubmitButtonProps) {
  return (
    <button
      type="submit"
      disabled={isPending}
      aria-busy={isPending}
      className="flex w-full items-center justify-center gap-2 rounded-full bg-rose px-6 py-3 text-lg font-semibold text-white shadow-sm transition-colors hover:bg-crimson disabled:opacity-70"
    >
      {isPending ? <LoaderCircle aria-hidden className="size-5 animate-spin" /> : null}
      {isPending ? pendingLabel : children}
    </button>
  );
}
