"use client";

import { useState, useTransition, type FormEvent } from "react";
import { updateEventSettingsAction } from "../controllers/update-event-settings.actions";
import type { EventSettingsSnapshot } from "../types";
import { EventSettingsFields } from "./event-settings-fields";
import { PixSettingsFields } from "./pix-settings-fields";

type EventSettingsFormProps = { settings: EventSettingsSnapshot };

type FeedbackMessage = { kind: "success" | "error"; text: string };

export function EventSettingsForm({ settings }: EventSettingsFormProps) {
  const [isPending, startTransition] = useTransition();
  const [feedback, setFeedback] = useState<FeedbackMessage | null>(null);

  function submit(event: FormEvent<HTMLFormElement>) {
    event.preventDefault();
    const input = Object.fromEntries(new FormData(event.currentTarget));
    startTransition(async () => {
      const result = await updateEventSettingsAction(input);
      setFeedback(
        result.ok
          ? { kind: "success", text: "Configurações salvas." }
          : { kind: "error", text: result.error },
      );
    });
  }

  return (
    <form onSubmit={submit} className="flex max-w-2xl flex-col gap-4">
      <EventSettingsFields settings={settings} />
      <PixSettingsFields settings={settings} />
      <button
        type="submit"
        disabled={isPending}
        className="rounded-full bg-rose px-6 py-2.5 text-lg text-white transition-colors hover:bg-crimson disabled:opacity-60"
      >
        {isPending ? "Salvando..." : "Salvar"}
      </button>
      {feedback ? (
        <p role="status" className={feedback.kind === "error" ? "text-crimson" : "text-wine"}>
          {feedback.text}
        </p>
      ) : null}
    </form>
  );
}
