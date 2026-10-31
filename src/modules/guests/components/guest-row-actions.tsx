"use client";

import { useRouter } from "next/navigation";
import { useState } from "react";
import { ConfirmDialog } from "@/shared/ui/confirm-dialog";
import { useConfirmDialog } from "@/shared/ui/use-confirm-dialog";
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
  const { ask, dialogProps } = useConfirmDialog();

  async function copyInviteUrl() {
    await navigator.clipboard.writeText(inviteUrl);
    setFeedback("Link copiado.");
  }

  function confirmAction(
    action: () => Promise<{ ok: boolean; error?: string }>,
    copy: { title: string; description: string; confirmLabel: string; tone?: "destructive" },
  ) {
    ask({
      ...copy,
      onConfirm: async () => {
        const result = await action();
        if (result.ok) router.refresh();
        return result;
      },
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
          onClick={() =>
            confirmAction(() => regenerateGuestCodeAction({ guestId: guest.id }), {
              title: `Gerar novo código para ${guest.name}?`,
              description: "O código atual deixará de funcionar e o link já enviado precisará ser reenviado.",
              confirmLabel: "Gerar novo código",
            })
          }
        >
          Novo código
        </Button>
        <Button
          size="sm"
          variant="destructive"
          onClick={() =>
            confirmAction(() => deleteGuestAction({ guestId: guest.id }), {
              title: `Excluir ${guest.name}?`,
              description: "O convidado será removido da lista. Essa ação não pode ser desfeita.",
              confirmLabel: "Excluir convidado",
              tone: "destructive",
            })
          }
        >
          Excluir
        </Button>
      </div>
      {feedback ? <p role="status" className="text-sm text-muted-foreground">{feedback}</p> : null}
      <ConfirmDialog {...dialogProps} />
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
