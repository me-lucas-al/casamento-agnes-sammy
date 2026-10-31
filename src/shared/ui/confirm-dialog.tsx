"use client";

import { useEffect, useId, useRef, type KeyboardEvent, type MouseEvent, type SyntheticEvent } from "react";
import { Button } from "@/shared/ui/button";
import { cn } from "@/shared/lib/utils";
import type { ConfirmDialogState } from "./lib/confirm-dialog-state";

type ConfirmDialogProps = {
  state: ConfirmDialogState;
  onConfirm: () => void;
  onCancel: () => void;
};

export function ConfirmDialog({ state, onConfirm, onCancel }: ConfirmDialogProps) {
  const dialogRef = useRef<HTMLDialogElement>(null);
  const cancelRef = useRef<HTMLButtonElement>(null);
  const titleId = useId();
  const descriptionId = useId();
  const { request, status } = state;
  const isPending = status === "pending";
  const isOpen = status !== "closed";
  const error = state.status === "open" ? state.error : "";

  useEffect(() => {
    const dialog = dialogRef.current;
    if (!dialog) return;
    if (!isOpen) {
      if (dialog.open) dialog.close();
      return;
    }
    if (!dialog.open) dialog.showModal();
    const previousOverflow = document.body.style.overflow;
    document.body.style.overflow = "hidden";
    return () => {
      document.body.style.overflow = previousOverflow;
    };
  }, [isOpen]);

  useEffect(() => {
    if (status === "open") cancelRef.current?.focus({ preventScroll: true });
  }, [status]);

  function handleNativeCancel(event: SyntheticEvent<HTMLDialogElement>) {
    event.preventDefault();
    if (!isPending) onCancel();
  }

  function trapTab(event: KeyboardEvent<HTMLDialogElement>) {
    if (event.key !== "Tab") return;
    const buttons = [...event.currentTarget.querySelectorAll<HTMLButtonElement>("button:not([disabled])")];
    if (buttons.length === 0) return event.preventDefault();
    const edge = buttons[event.shiftKey ? 0 : buttons.length - 1];
    if (document.activeElement !== edge) return;
    event.preventDefault();
    buttons[event.shiftKey ? buttons.length - 1 : 0].focus();
  }

  function handleBackdropClick(event: MouseEvent<HTMLDialogElement>) {
    if (event.target === event.currentTarget && !isPending) onCancel();
  }

  return (
    <dialog
      ref={dialogRef}
      role="alertdialog"
      aria-labelledby={titleId}
      aria-describedby={descriptionId}
      onCancel={handleNativeCancel}
      onKeyDown={trapTab}
      onClick={handleBackdropClick}
      className="fixed inset-x-0 bottom-0 top-auto m-0 w-full max-w-none overflow-visible bg-transparent p-0 text-wine backdrop:bg-wine/60 sm:inset-0 sm:m-auto sm:h-fit sm:max-w-md"
    >
      <div
        className={cn(
          "rounded-t-[1.75rem] border border-gold/60 bg-paper px-5 pb-[max(1.25rem,env(safe-area-inset-bottom))] pt-6 shadow-2xl sm:rounded-[1.75rem] sm:p-7",
          "motion-safe:animate-in motion-safe:fade-in motion-safe:slide-in-from-bottom-6 motion-safe:duration-200 sm:motion-safe:slide-in-from-bottom-2",
        )}
      >
        <h2 id={titleId} className="font-heading text-2xl italic leading-tight">
          {request?.title}
        </h2>
        <div aria-hidden className="my-3 flex items-center gap-2">
          <span className="h-px flex-1 bg-wine/40" />
          <span className="text-xs text-rose-soft">&#9829;</span>
          <span className="h-px flex-1 bg-wine/40" />
        </div>
        <p id={descriptionId} className="text-base">
          {request?.description}
        </p>
        {error ? (
          <p role="alert" className="mt-3 text-sm text-crimson">
            {error}
          </p>
        ) : null}
        <div className="mt-5 flex flex-col-reverse gap-2 sm:flex-row sm:justify-end">
          <Button ref={cancelRef} type="button" variant="outline" disabled={isPending} onClick={onCancel}>
            Cancelar
          </Button>
          <Button
            type="button"
            disabled={isPending}
            aria-busy={isPending}
            onClick={onConfirm}
            className={cn(
              "text-white",
              request?.tone === "destructive"
                ? "bg-crimson hover:bg-crimson/90"
                : "bg-rose hover:bg-rose/90",
            )}
          >
            {isPending ? "Aguarde..." : request?.confirmLabel}
          </Button>
        </div>
      </div>
    </dialog>
  );
}
