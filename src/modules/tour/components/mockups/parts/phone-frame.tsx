import type { ReactNode } from "react";
import { cn } from "@/shared/lib/styling/utils";

type PhoneFrameProps = { label: string; className?: string; children: ReactNode };

export function PhoneFrame({ label, className, children }: PhoneFrameProps) {
  return (
    <div
      role="group"
      aria-label={label}
      className={cn(
        "relative w-full max-w-[17.5rem] overflow-hidden rounded-[2rem] border-[6px] border-wine bg-paper shadow-xl",
        className,
      )}
    >
      <span aria-hidden className="absolute left-1/2 top-1.5 z-10 h-1.5 w-14 -translate-x-1/2 rounded-full bg-wine" />
      <div className="flex min-h-[25rem] flex-col gap-3 px-3 pb-4 pt-6">{children}</div>
    </div>
  );
}
