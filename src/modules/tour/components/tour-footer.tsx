import { ArrowLeft, ArrowRight, Heart } from "lucide-react";
import { Button } from "@/shared/ui/button";
import type { TourStepDefinition } from "../lib/build-tour-steps";
import { isLastStep } from "../lib/tour-navigation";
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
    <footer className="flex flex-col gap-2 border-t border-gold/40 bg-paper-dark/70 px-4 py-3 sm:px-6">
      <TourProgressDots steps={steps} currentIndex={currentIndex} onSelect={onSelect} />
      <div className="grid grid-cols-2 gap-3 sm:flex sm:justify-between">
        <Button type="button" variant="outline" size="lg" onClick={onPrevious} disabled={currentIndex === 0}>
          <ArrowLeft aria-hidden />
          Voltar
        </Button>
        {isFinal ? (
          <Button type="button" size="lg" onClick={onFinish}>
            Começar
            <Heart aria-hidden className="fill-current" />
          </Button>
        ) : (
          <Button type="button" size="lg" onClick={onNext}>
            Próximo
            <ArrowRight aria-hidden />
          </Button>
        )}
      </div>
    </footer>
  );
}
