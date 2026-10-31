"use client";

import { useCallback, useEffect, useRef, useState, type KeyboardEvent } from "react";
import { FloralCorners } from "@/shared/ui/components/floral-corners";
import type { TourStepDefinition } from "@/modules/tour/lib/build-tour-steps";
import { findWrapTarget } from "@/modules/tour/lib/focus-trap";
import { isLastStep, nextStepIndex, previousStepIndex, slideDirection } from "@/modules/tour/lib/tour-navigation";
import { TourFooter } from "./tour-footer";
import { TourHeader } from "./tour-header";
import { TourControlsProvider } from "./tour-controls";
import { renderTourStep } from "../steps/render-tour-step";
import { cn } from "@/shared/lib/utils";

type TourDialogProps = { steps: readonly TourStepDefinition[]; onClosed: () => void };

type StepPosition = { index: number; direction: "forward" | "backward" };

const TYPING_TAGS = ["INPUT", "TEXTAREA", "SELECT"];

export function TourDialog({ steps, onClosed }: TourDialogProps) {
  const dialogRef = useRef<HTMLDialogElement>(null);
  const bodyRef = useRef<HTMLDivElement>(null);
  const [position, setPosition] = useState<StepPosition>({ index: 0, direction: "forward" });
  const stepCount = steps.length;

  useEffect(() => {
    const dialog = dialogRef.current;
    if (dialog && !dialog.open) dialog.showModal();
  }, []);

  useEffect(() => {
    const body = bodyRef.current;
    if (!body) return;
    body.scrollTo({ top: 0 });
    body.querySelector<HTMLElement>("[data-tour-heading]")?.focus({ preventScroll: true });
  }, [position.index]);

  const closeTour = useCallback(() => dialogRef.current?.close(), []);

  const goTo = useCallback(
    (nextIndex: number) =>
      setPosition((current) => ({ index: nextIndex, direction: slideDirection(current.index, nextIndex) })),
    [],
  );

  function handleKeyDown(event: KeyboardEvent<HTMLDialogElement>) {
    if (event.key === "Tab" && dialogRef.current) {
      const wrapTarget = findWrapTarget(dialogRef.current, event.shiftKey);
      if (!wrapTarget) return;
      event.preventDefault();
      wrapTarget.focus();
      return;
    }
    const target = event.target as HTMLElement;
    if (event.altKey || event.ctrlKey || event.metaKey || TYPING_TAGS.includes(target.tagName)) return;
    if (event.key === "ArrowRight") goTo(nextStepIndex(position.index, stepCount));
    if (event.key === "ArrowLeft") goTo(previousStepIndex(position.index, stepCount));
  }

  const currentStep = steps[position.index];
  return (
    <dialog
      ref={dialogRef}
      aria-labelledby="tour-position"
      aria-describedby="tour-body"
      onClose={onClosed}
      onKeyDown={handleKeyDown}
      className="fixed inset-0 m-0 hidden h-dvh max-h-none w-full max-w-none flex-col overflow-hidden bg-paper text-wine open:flex backdrop:bg-wine/70 sm:m-auto sm:h-[min(54rem,94dvh)] sm:max-w-6xl sm:rounded-3xl sm:border sm:border-gold/60 sm:shadow-2xl"
    >
      <FloralCorners area="top" className="w-14 sm:w-24" />
      <TourControlsProvider value={{ closeTour }}>
        <TourHeader
          currentIndex={position.index}
          stepCount={stepCount}
          isFinal={isLastStep(position.index, stepCount)}
          onSkip={closeTour}
        />
        <div id="tour-body" ref={bodyRef} className="relative z-10 flex-1 overflow-y-auto overflow-x-hidden px-4 pb-6 pt-2 sm:px-10 sm:pt-12">
          <div
            key={currentStep.id}
            className={cn(
              "animate-in fade-in duration-300",
              position.direction === "forward" ? "slide-in-from-right-8" : "slide-in-from-left-8",
            )}
          >
            {renderTourStep(currentStep.id)}
          </div>
        </div>
        <TourFooter
          steps={steps}
          currentIndex={position.index}
          onSelect={goTo}
          onPrevious={() => goTo(previousStepIndex(position.index, stepCount))}
          onNext={() => goTo(nextStepIndex(position.index, stepCount))}
          onFinish={closeTour}
        />
      </TourControlsProvider>
    </dialog>
  );
}
