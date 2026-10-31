"use client";

import { SlidersHorizontal } from "lucide-react";
import { useId, useState, type ReactNode } from "react";
import { cn } from "@/shared/lib/utils";

type MobileFilterPanelProps = {
  activeCount: number;
  children: ReactNode;
};

export function MobileFilterPanel({ activeCount, children }: MobileFilterPanelProps) {
  const [isOpen, setIsOpen] = useState(false);
  const panelId = useId();
  return (
    <div className="flex flex-col gap-3">
      <button
        type="button"
        aria-expanded={isOpen}
        aria-controls={panelId}
        onClick={() => setIsOpen((current) => !current)}
        className="flex min-h-11 w-fit items-center gap-2 rounded-full border border-gold bg-card px-5 text-base font-semibold text-wine hover:bg-blush lg:hidden"
      >
        <SlidersHorizontal aria-hidden className="size-4" />
        Filtros{activeCount > 0 ? ` (${activeCount})` : ""}
      </button>
      <div id={panelId} className={cn(isOpen ? "block" : "hidden", "lg:block")}>
        {children}
      </div>
    </div>
  );
}
