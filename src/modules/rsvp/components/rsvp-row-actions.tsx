"use client";

import { useRouter } from "next/navigation";
import { useState, useTransition } from "react";
import { ConfirmDialog } from "@/shared/ui/dialogs/confirm-dialog";
import { useConfirmDialog } from "@/shared/ui/dialogs/use-confirm-dialog";
import { getPanelGuestRsvpAction } from "../controllers/actions/get-panel-guest-rsvp.action";
import { deleteRsvpAction, submitRsvpForGuestAction } from "../controllers/actions/submit-rsvp.actions";
import type { GuestRsvp } from "../types";
import { RsvpForm } from "./rsvp-form";

type Mode = "idle" | "editing";

type RsvpRowActionsProps = { guestId: string; guestName: string };

const actionButtonClassName = "rounded-full border border-wine/30 px-3 py-1 text-sm text-wine disabled:opacity-60";

export function RsvpRowActions({ guestId, guestName }: RsvpRowActionsProps) {
  const { ask, dialogProps } = useConfirmDialog();
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

  const requestDeletion = () =>
    ask({
      title: `Excluir a resposta de ${guestName}?`,
      description: "A confirmação de presença será apagada. Essa ação não pode ser desfeita.",
      confirmLabel: "Excluir resposta",
      tone: "destructive",
      onConfirm: async () => {
        const result = await deleteRsvpAction(guestId);
        if (result.ok) router.refresh();
        return result;
      },
    });

  return (
    <div className="flex w-full flex-col gap-3 sm:w-auto sm:items-end">
      {mode === "idle" ? (
        <div className="flex gap-2">
          <button type="button" className={actionButtonClassName} disabled={isPending} onClick={startEditing}>
            Editar
          </button>
          <button type="button" className={actionButtonClassName} onClick={requestDeletion}>
            Excluir
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
          <button type="button" className="mt-2 text-sm text-wine underline" onClick={() => setMode("idle")}>
            Cancelar
          </button>
        </div>
      ) : null}
      {errorMessage ? <p role="status" className="text-sm text-crimson">{errorMessage}</p> : null}
      <ConfirmDialog {...dialogProps} />
    </div>
  );
}
