"use client";

import { useState, useTransition } from "react";
import { deleteMessageAction, moderateMessageAction, updateMessageAction } from "../controllers/message.actions";
import type { Message } from "../types";

const buttonClassName = "rounded-full border border-wine/30 px-3 py-1 text-xs text-wine disabled:opacity-50";

export function ModerationActions({ message }: { message: Message }) {
  const [isEditing, setIsEditing] = useState(false);
  const [body, setBody] = useState(message.body);
  const [error, setError] = useState<string | null>(null);
  const [isPending, startTransition] = useTransition();

  const run = (action: () => Promise<{ ok: boolean; error?: string }>) =>
    startTransition(async () => {
      const result = await action();
      setError(result.ok ? null : (result.error ?? "Erro."));
      if (result.ok) setIsEditing(false);
    });

  const moderate = (decision: "approved" | "rejected") =>
    run(() => moderateMessageAction({ messageId: message.id, decision }));
  const saveEdit = () =>
    run(() => updateMessageAction({ messageId: message.id, authorName: message.authorName, body }));

  return (
    <div className="flex flex-col gap-2">
      {isEditing ? (
        <textarea
          aria-label="Editar recado"
          className="w-full rounded-lg border border-wine/30 bg-paper p-2 text-sm"
          rows={3}
          value={body}
          maxLength={500}
          onChange={(event) => setBody(event.target.value)}
        />
      ) : null}
      <div className="flex flex-wrap gap-2">
        <button type="button" disabled={isPending} className={buttonClassName} onClick={() => moderate("approved")}>
          Aprovar
        </button>
        <button type="button" disabled={isPending} className={buttonClassName} onClick={() => moderate("rejected")}>
          Rejeitar
        </button>
        {isEditing ? (
          <button type="button" disabled={isPending} className={buttonClassName} onClick={saveEdit}>
            Salvar
          </button>
        ) : (
          <button type="button" className={buttonClassName} onClick={() => setIsEditing(true)}>
            Editar
          </button>
        )}
        <button
          type="button"
          disabled={isPending}
          className={buttonClassName}
          onClick={() => run(() => deleteMessageAction(message.id))}
        >
          Excluir
        </button>
      </div>
      {error ? <p role="alert" className="text-xs text-crimson">{error}</p> : null}
    </div>
  );
}
