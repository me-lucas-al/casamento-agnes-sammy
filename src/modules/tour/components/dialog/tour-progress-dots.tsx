import { cn } from "@/shared/lib/utils";
import type { TourStepDefinition } from "@/modules/tour/lib/build-tour-steps";

type TourProgressDotsProps = {
  steps: readonly TourStepDefinition[];
  currentIndex: number;
  onSelect: (index: number) => void;
};

export function TourProgressDots({ steps, currentIndex, onSelect }: TourProgressDotsProps) {
  return (
    <>
      <div aria-hidden className="flex items-center justify-center gap-1.5 sm:hidden">
        {steps.map((step, index) => (
          <span
            key={step.id}
            className={cn(
              "h-2 rounded-full transition-all duration-300",
              index === currentIndex ? "w-6 bg-rose" : "w-2",
              index < currentIndex ? "bg-rose/50" : index > currentIndex && "bg-gold/50",
            )}
          />
        ))}
      </div>
      <ol aria-label="Passos do tour" className="hidden items-center justify-center sm:flex">
        {steps.map((step, index) => (
          <li key={step.id}>
            <button
              type="button"
              aria-label={`Ir para ${step.navLabel}`}
              aria-current={index === currentIndex ? "step" : undefined}
              onClick={() => onSelect(index)}
              className="group flex size-11 items-center justify-center rounded-full"
            >
              <span
                className={cn(
                  "block h-2.5 rounded-full transition-all duration-300 group-hover:bg-rose",
                  index === currentIndex ? "w-7 bg-rose" : "w-2.5",
                  index < currentIndex && "bg-rose/50",
                  index > currentIndex && "bg-gold/60",
                )}
              />
            </button>
          </li>
        ))}
      </ol>
    </>
  );
}
