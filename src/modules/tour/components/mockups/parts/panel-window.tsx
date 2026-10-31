import type { ReactNode } from "react";
import { cn } from "@/shared/lib/styling/utils";

type PanelWindowProps = { title: string; label: string; className?: string; children: ReactNode };

export function PanelWindow({ title, label, className, children }: PanelWindowProps) {
  return (
    <div
      role="group"
      aria-label={label}
      className={cn("w-full max-w-md overflow-hidden rounded-2xl border border-gold/60 bg-card shadow-lg", className)}
    >
      <div className="flex items-center gap-2 border-b border-gold/40 bg-paper-dark px-3 py-2">
        <span aria-hidden className="flex gap-1">
          <span className="size-2.5 rounded-full bg-rose/60" />
          <span className="size-2.5 rounded-full bg-gold/70" />
          <span className="size-2.5 rounded-full bg-wine/40" />
        </span>
        <span className="truncate font-script text-xl leading-none text-wine">{title}</span>
      </div>
      <div className="flex flex-col gap-3 p-3 sm:p-4">{children}</div>
    </div>
  );
}
