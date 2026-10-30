"use client";

import { useRouter } from "next/navigation";
import { useState, useTransition } from "react";
import { getPanelGuestRsvpAction } from "../controllers/get-panel-guest-rsvp.action";
import { deleteRsvpAction, submitRsvpForGuestAction } from "../controllers/submit-rsvp.actions";
import type { GuestRsvp } from "../types";
import { RsvpForm } from "./rsvp-form";

type Mode = "idle" | "editing" | "confirmingDelete";

const actionButtonClassName = "rounded-full border border-wine/30 px-3 py-1 text-xs text-wine disabled:opacity-60";

export function RsvpRowActions({ guestId }: { guestId: string }) {
  const router = useRouter();
  const [mode, setMode] = useState<Mode>("idle");
  const [guestRsvp, setGuestRsvp] = useState<GuestRsvp | null>(null);
  const [errorMessage, setErrorMessage] = useState<string | null>(null);
  const [isPending, startTransition] = useTransition();

  const finish = () => {
    setMode("idle");
    router.refresh();
  };

  const startEditing = () =>
    startTransition(async () => {
      setErrorMessage(null);
      const result = await getPanelGuestRsvpAction(guestId);
      if (!result.ok) return setErrorMessage(result.error);
      setGuestRsvp(result.data);
      setMode("editing");
    });

  const confirmDelete = () =>
    startTransition(async () => {
      const result = await deleteRsvpAction(guestId);
      if (!result.ok) return setErrorMessage(result.error);
      finish();
    });

  return (
    <div className="flex w-full flex-col gap-3 sm:w-auto sm:items-end">
      {mode === "idle" ? (
        <div className="flex gap-2">
          <button type="button" className={actionButtonClassName} disabled={isPending} onClick={startEditing}>
            Editar
          </button>
          <button type="button" className={actionButtonClassName} onClick={() => setMode("confirmingDelete")}>
            Excluir
          </button>
        </div>
      ) : null}
      {mode === "confirmingDelete" ? (
        <div role="alert" className="flex flex-wrap items-center gap-2 text-xs text-wine">
          <span>Excluir esta resposta?</span>
          <button type="button" className={`${actionButtonClassName} text-crimson`} disabled={isPending} onClick={confirmDelete}>
            Confirmar
          </button>
          <button type="button" className={actionButtonClassName} onClick={() => setMode("idle")}>
            Cancelar
          </button>
        </div>
      ) : null}
      {mode === "editing" && guestRsvp ? (
        <div className="w-full rounded-lg bg-paper p-3 sm:w-80">
          <RsvpForm
            initial={guestRsvp}
            onSubmit={(input) => submitRsvpForGuestAction({ ...input, guestId })}
            onSaved={finish}
          />
          <button type="button" className="mt-2 text-xs text-wine underline" onClick={() => setMode("idle")}>
            Cancelar
          </button>
        </div>
      ) : null}
      {errorMessage ? <p role="status" className="text-xs text-crimson">{errorMessage}</p> : null}
    </div>
  );
}
