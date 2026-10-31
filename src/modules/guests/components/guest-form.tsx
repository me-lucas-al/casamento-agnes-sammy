"use client";

import { useState, useTransition, type FormEvent } from "react";
import { Button } from "@/shared/ui/primitives/button";
import type { ActionResult } from "@/shared/lib/actions/result";

type GuestFormValues = { name: string; phone: string; seats: number };

type GuestFormProps = {
  initialValues?: GuestFormValues;
  submitLabel: string;
  onSubmit: (values: GuestFormValues) => Promise<ActionResult<unknown>>;
  onDone?: () => void;
};

const inputClassName = "h-9 w-full rounded-lg border bg-background px-3 text-sm";
const emptyValues: GuestFormValues = { name: "", phone: "", seats: 1 };

export function GuestForm({ initialValues = emptyValues, submitLabel, onSubmit, onDone }: GuestFormProps) {
  const [errorMessage, setErrorMessage] = useState("");
  const [isPending, startTransition] = useTransition();

  function handleSubmit(event: FormEvent<HTMLFormElement>) {
    event.preventDefault();
    const form = event.currentTarget;
    const formData = new FormData(form);
    const values = {
      name: String(formData.get("name") ?? ""),
      phone: String(formData.get("phone") ?? ""),
      seats: Number(formData.get("seats") ?? 1),
    };
    startTransition(async () => {
      const result = await onSubmit(values);
      if (!result.ok) return setErrorMessage(result.error);
      setErrorMessage("");
      if (initialValues === emptyValues) form.reset();
      onDone?.();
    });
  }

  return (
    <form onSubmit={handleSubmit} className="grid gap-3 sm:grid-cols-[2fr_1.5fr_6rem_auto] sm:items-end">
      <label className="grid gap-1 text-sm">
        Nome
        <input name="name" required minLength={2} defaultValue={initialValues.name} className={inputClassName} />
      </label>
      <label className="grid gap-1 text-sm">
        Telefone (opcional)
        <input name="phone" type="tel" defaultValue={initialValues.phone} className={inputClassName} />
      </label>
      <label className="grid gap-1 text-sm">
        Vagas
        <input
          name="seats"
          type="number"
          min={1}
          max={20}
          required
          defaultValue={initialValues.seats}
          className={inputClassName}
        />
      </label>
      <Button type="submit" disabled={isPending}>
        {isPending ? "Salvando..." : submitLabel}
      </Button>
      {errorMessage ? (
        <p role="alert" className="text-sm text-destructive sm:col-span-4">
          {errorMessage}
        </p>
      ) : null}
    </form>
  );
}
