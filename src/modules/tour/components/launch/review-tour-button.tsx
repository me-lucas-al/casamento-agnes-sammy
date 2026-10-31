"use client";

import { Sparkles } from "lucide-react";
import { cn } from "@/shared/lib/styling/utils";
import { useTour } from "./tour-provider";

type ReviewTourButtonProps = { className?: string };

export function ReviewTourButton({ className }: ReviewTourButtonProps) {
  const { openTour } = useTour();
  return (
    <button type="button" onClick={openTour} className={cn("inline-flex items-center gap-2 rounded-full", className)}>
      <Sparkles aria-hidden className="size-4 text-rose" />
      Rever tour
    </button>
  );
}
