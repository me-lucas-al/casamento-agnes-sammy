import { ArrowLeft, ArrowRight, Heart } from "lucide-react";
import { Button } from "@/shared/ui/primitives/button";
import type { TourStepDefinition } from "@/modules/tour/lib/build-tour-steps";
import { isLastStep } from "@/modules/tour/lib/tour-navigation";
import { TourProgressDots } from "./tour-progress-dots";

type TourFooterProps = {
  steps: readonly TourStepDefinition[];
  currentIndex: number;
  onSelect: (index: number) => void;
  onPrevious: () => void;
  onNext: () => void;
  onFinish: () => void;
};

export function TourFooter({ steps, currentIndex, onSelect, onPrevious, onNext, onFinish }: TourFooterProps) {
  const isFinal = isLastStep(currentIndex, steps.length);
  return (
    <footer className="grid grid-cols-2 gap-x-3 gap-y-2 border-t border-gold/40 bg-paper-dark/70 px-4 py-3 sm:grid-cols-[auto_1fr_auto] sm:items-center sm:px-6 sm:py-2">
      <div className="col-span-2 sm:col-span-1 sm:col-start-2 sm:row-start-1">
        <TourProgressDots steps={steps} currentIndex={currentIndex} onSelect={onSelect} />
      </div>
      <Button
        type="button"
        variant="outline"
        size="lg"
        className="sm:col-start-1 sm:row-start-1"
        onClick={onPrevious}
        disabled={currentIndex === 0}
      >
        <ArrowLeft aria-hidden />
        Voltar
      </Button>
      {isFinal ? (
        <Button type="button" size="lg" className="sm:col-start-3 sm:row-start-1" onClick={onFinish}>
          Começar
          <Heart aria-hidden className="fill-current" />
        </Button>
      ) : (
        <Button type="button" size="lg" className="sm:col-start-3 sm:row-start-1" onClick={onNext}>
          Próximo
          <ArrowRight aria-hidden />
        </Button>
      )}
    </footer>
  );
}
