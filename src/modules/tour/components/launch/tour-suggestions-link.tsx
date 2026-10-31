"use client";

import { Gift } from "lucide-react";
import Link from "next/link";
import { useTourControls } from "../dialog/tour-controls";

export function TourSuggestionsLink() {
  const { closeTour } = useTourControls();
  return (
    <Link
      href="/painel/presentes/sugestoes"
      onClick={closeTour}
      className="inline-flex min-h-11 w-fit items-center gap-2 rounded-full border border-gold bg-card px-5 text-base font-semibold text-wine transition-colors hover:bg-blush"
    >
      <Gift aria-hidden className="size-4" />
      Ver sugestões de presentes
    </Link>
  );
}
