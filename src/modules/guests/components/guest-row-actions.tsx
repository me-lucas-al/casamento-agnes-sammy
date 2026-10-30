"use client";

import { useRouter } from "next/navigation";
import { useState, useTransition } from "react";
import { Button, buttonVariants } from "@/shared/ui/button";
import {
  deleteGuestAction,
  regenerateGuestCodeAction,
  updateGuestAction,
} from "../controllers/guest.actions";
import type { Guest } from "../types";
import { GuestForm } from "./guest-form";

type GuestRowActionsProps = {
  guest: Pick<Guest, "id" | "name" | "phone" | "seats">;
  inviteUrl: string;
  whatsappUrl: string;
};

export function GuestRowActions({ guest, inviteUrl, whatsappUrl }: GuestRowActionsProps) {
  const router = useRouter();
  const [isEditing, setIsEditing] = useState(false);
  const [feedback, setFeedback] = useState("");
  const [isPending, startTransition] = useTransition();

  async function copyInviteUrl() {
    await navigator.clipboard.writeText(inviteUrl);
    setFeedback("Link copiado.");
  }

  function runAction(action: () => Promise<{ ok: boolean; error?: string }>, confirmation?: string) {
    if (confirmation && !window.confirm(confirmation)) return;
    startTransition(async () => {
      const result = await action();
      setFeedback(result.ok ? "" : (result.error ?? ""));
      router.refresh();
    });
  }

  return (
    <div className="flex flex-col gap-2">
      <div className="flex flex-wrap gap-2">
        <Button size="sm" variant="outline" onClick={copyInviteUrl}>
          Copiar link
        </Button>
        <a
          href={whatsappUrl}
          target="_blank"
          rel="noreferrer"
          className={buttonVariants({ variant: "outline", size: "sm" })}
        >
          WhatsApp
        </a>
        <Button size="sm" variant="outline" onClick={() => setIsEditing((current) => !current)}>
          Editar
        </Button>
        <Button
          size="sm"
          variant="outline"
          disabled={isPending}
          onClick={() =>
            runAction(
              () => regenerateGuestCodeAction({ guestId: guest.id }),
              "Gerar novo código? O código atual deixará de funcionar.",
            )
          }
        >
          Novo código
        </Button>
        <Button
          size="sm"
          variant="destructive"
          disabled={isPending}
          onClick={() =>
            runAction(() => deleteGuestAction({ guestId: guest.id }), `Excluir ${guest.name}?`)
          }
        >
          Excluir
        </Button>
      </div>
      {feedback ? <p role="status" className="text-xs text-muted-foreground">{feedback}</p> : null}
      {isEditing ? (
        <GuestForm
          submitLabel="Salvar"
          initialValues={{ name: guest.name, phone: guest.phone ?? "", seats: guest.seats }}
          onSubmit={(values) => updateGuestAction({ guestId: guest.id, ...values })}
          onDone={() => {
            setIsEditing(false);
            router.refresh();
          }}
        />
      ) : null}
    </div>
  );
}
