"use client";

import { useState, useTransition, type FormEvent } from "react";
import { sendMessageAction } from "../controllers/actions/message.actions";
import { MAX_BODY_LENGTH } from "../lib/sanitize-message";

type MessageFormProps = { defaultAuthorName: string };

const fieldClassName = "w-full rounded-lg border border-input bg-card px-3 py-2 text-base";

export function MessageForm({ defaultAuthorName }: MessageFormProps) {
  const [authorName, setAuthorName] = useState(defaultAuthorName);
  const [body, setBody] = useState("");
  const [feedback, setFeedback] = useState<{ text: string; isError: boolean } | null>(null);
  const [isPending, startTransition] = useTransition();

  const submit = (event: FormEvent) => {
    event.preventDefault();
    startTransition(async () => {
      const result = await sendMessageAction({ authorName, body });
      if (!result.ok) return setFeedback({ text: result.error, isError: true });
      setBody("");
      setFeedback({ text: "Recado enviado! Ele aparecerá após a aprovação dos noivos.", isError: false });
    });
  };

  return (
    <form onSubmit={submit} className="flex flex-col gap-3">
      <label htmlFor="message-author" className="text-base font-medium">
        Seu nome
      </label>
      <input
        id="message-author"
        className={fieldClassName}
        value={authorName}
        maxLength={80}
        onChange={(event) => setAuthorName(event.target.value)}
      />
      <label htmlFor="message-body" className="text-base font-medium">
        Seu recado
      </label>
      <textarea
        id="message-body"
        className={fieldClassName}
        rows={4}
        value={body}
        maxLength={MAX_BODY_LENGTH}
        placeholder="Deixe um recado carinhoso"
        onChange={(event) => setBody(event.target.value)}
      />
      <p className="text-right text-sm text-muted-foreground">
        {body.length}/{MAX_BODY_LENGTH}
      </p>
      {feedback ? (
        <p role="status" className={feedback.isError ? "text-crimson" : "text-wine"}>
          {feedback.text}
        </p>
      ) : null}
      <button type="submit" disabled={isPending} className="rounded-full bg-rose px-6 py-3 text-lg text-white transition-colors hover:bg-crimson disabled:opacity-60">
        {isPending ? "Enviando..." : "Enviar recado"}
      </button>
    </form>
  );
}
