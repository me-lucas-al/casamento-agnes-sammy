"use client";

import { useState, useTransition, type FormEvent } from "react";
import { submitRsvpAction } from "../controllers/submit-rsvp.actions";
import type { ActionResult } from "@/shared/lib/result";
import type { Companion, GuestRsvp, RsvpAnswer } from "../types";
import { CompanionFields } from "./companion-fields";

type RsvpFormInput = { status: RsvpAnswer; dietaryNote: string; companions: Companion[] };

type RsvpFormProps = {
  initial: GuestRsvp;
  onSubmit?: (input: RsvpFormInput) => Promise<ActionResult>;
  onSaved?: () => void;
};

const answerOptions: { value: RsvpAnswer; label: string }[] = [
  { value: "going", label: "Vou com alegria" },
  { value: "declined", label: "Não poderei ir" },
];

export function RsvpForm({ initial, onSubmit = submitRsvpAction, onSaved }: RsvpFormProps) {
  const [status, setStatus] = useState<RsvpAnswer>(initial.status === "declined" ? "declined" : "going");
  const [dietaryNote, setDietaryNote] = useState(initial.dietaryNote ?? "");
  const [companions, setCompanions] = useState<Companion[]>(initial.companions);
  const [message, setMessage] = useState<{ text: string; isError: boolean } | null>(null);
  const [isPending, startTransition] = useTransition();

  const submit = (event: FormEvent) => {
    event.preventDefault();
    startTransition(async () => {
      const result = await onSubmit({ status, dietaryNote, companions });
      if (result.ok) onSaved?.();
      setMessage(
        result.ok
          ? { text: "Resposta registrada. Obrigado!", isError: false }
          : { text: result.error, isError: true },
      );
    });
  };

  return (
    <form onSubmit={submit} className="flex flex-col gap-5">
      <div role="radiogroup" className="flex flex-col gap-2">
        {answerOptions.map(({ value, label }) => (
          <label key={value} className="flex items-center gap-2 text-wine">
            <input type="radio" name="status" checked={status === value} onChange={() => setStatus(value)} />
            {label}
          </label>
        ))}
      </div>
      {status === "going" ? (
        <>
          <input
            aria-label="Sua restrição alimentar"
            className="w-full rounded-lg border border-wine/30 bg-paper px-3 py-2 text-sm"
            placeholder="Sua restrição alimentar (opcional)"
            value={dietaryNote}
            maxLength={200}
            onChange={(event) => setDietaryNote(event.target.value)}
          />
          <CompanionFields
            companions={companions}
            maxCompanions={Math.max(initial.seats - 1, 0)}
            onChange={setCompanions}
          />
        </>
      ) : null}
      {message ? (
        <p role="status" className={message.isError ? "text-crimson" : "text-wine"}>
          {message.text}
        </p>
      ) : null}
      <button type="submit" disabled={isPending} className="rounded-full bg-rose px-6 py-3 text-paper disabled:opacity-60">
        {isPending ? "Enviando..." : "Confirmar resposta"}
      </button>
    </form>
  );
}
