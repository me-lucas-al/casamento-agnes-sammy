"use client";

import { useRouter } from "next/navigation";
import { useId, useState, useTransition, type FormEvent } from "react";
import { updatePhotoCaptionAction } from "../controllers/update-photo-caption.actions";

type PhotoCaptionFormProps = { photoId: string; caption: string | null };

const CAPTION_MAX_LENGTH = 200;

export function PhotoCaptionForm({ photoId, caption }: PhotoCaptionFormProps) {
  const router = useRouter();
  const inputId = useId();
  const [value, setValue] = useState(caption ?? "");
  const [message, setMessage] = useState<{ text: string; isError: boolean } | null>(null);
  const [isPending, startTransition] = useTransition();

  function handleSubmit(event: FormEvent<HTMLFormElement>) {
    event.preventDefault();
    startTransition(async () => {
      const trimmedCaption = value.trim();
      const result = await updatePhotoCaptionAction({ photoId, caption: trimmedCaption || null });
      setMessage(result.ok ? { text: "Legenda salva.", isError: false } : { text: result.error, isError: true });
      if (result.ok) router.refresh();
    });
  }

  return (
    <form onSubmit={handleSubmit} className="flex flex-col gap-2">
      <label htmlFor={inputId} className="text-base text-wine">
        Legenda
      </label>
      <div className="flex flex-col gap-2">
        <input
          id={inputId}
          value={value}
          maxLength={CAPTION_MAX_LENGTH}
          placeholder="Escreva uma legenda"
          onChange={(event) => setValue(event.target.value)}
          className="min-w-0 flex-1 rounded-lg border border-input bg-card px-3 py-2"
        />
        <button
          type="submit"
          disabled={isPending}
          className="rounded-full bg-rose px-5 py-2 text-lg text-white transition-colors hover:bg-crimson disabled:opacity-50"
        >
          {isPending ? "Salvando..." : "Salvar legenda"}
        </button>
      </div>
      {message ? (
        <p role={message.isError ? "alert" : "status"} className={message.isError ? "text-sm text-crimson" : "text-sm text-wine"}>
          {message.text}
        </p>
      ) : null}
    </form>
  );
}
