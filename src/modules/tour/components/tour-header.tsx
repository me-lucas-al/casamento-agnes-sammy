import { X } from "lucide-react";
import { describeStepPosition } from "../lib/tour-navigation";

type TourHeaderProps = {
  currentIndex: number;
  stepCount: number;
  isFinal: boolean;
  onSkip: () => void;
};

export function TourHeader({ currentIndex, stepCount, isFinal, onSkip }: TourHeaderProps) {
  return (
    <header className="relative z-10 flex items-center justify-between gap-3 px-4 pb-2 pt-3 sm:px-6 sm:pl-28 sm:pr-28">
      <div className="flex flex-col pl-10 sm:pl-0">
        <span className="font-script text-3xl leading-none text-wine">Tour do site</span>
        <span id="tour-position" aria-live="polite" className="text-base font-semibold text-rose">
          {describeStepPosition(currentIndex, stepCount)}
        </span>
      </div>
      {isFinal ? null : (
        <button
          type="button"
          onClick={onSkip}
          className="inline-flex items-center gap-1.5 rounded-full border border-gold/60 bg-card/80 px-4 text-base hover:bg-blush"
        >
          <X aria-hidden className="size-4" />
          Pular tour
        </button>
      )}
    </header>
  );
}
