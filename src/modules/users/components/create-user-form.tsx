"use client";

import { useRouter } from "next/navigation";
import { useState, useTransition, type FormEvent } from "react";
import { Button } from "@/shared/ui/button";
import { createUserAction } from "../controllers/create-user.actions";

const inputClassName = "h-9 w-full rounded-lg border bg-background px-3 text-sm";

export function CreateUserForm() {
  const router = useRouter();
  const [errorMessage, setErrorMessage] = useState("");
  const [isPending, startTransition] = useTransition();

  function handleSubmit(event: FormEvent<HTMLFormElement>) {
    event.preventDefault();
    const form = event.currentTarget;
    const formData = new FormData(form);
    startTransition(async () => {
      const result = await createUserAction({
        name: formData.get("name"),
        email: formData.get("email"),
        role: formData.get("role"),
      });
      if (!result.ok) return setErrorMessage(result.error);
      setErrorMessage("");
      form.reset();
      router.refresh();
    });
  }

  return (
    <form onSubmit={handleSubmit} className="grid gap-3 rounded-xl border p-4 sm:grid-cols-[1fr_1.5fr_8rem_auto] sm:items-end">
      <label className="grid gap-1 text-sm">
        Nome
        <input name="name" required minLength={2} className={inputClassName} />
      </label>
      <label className="grid gap-1 text-sm">
        E-mail Google
        <input name="email" type="email" required className={inputClassName} />
      </label>
      <label className="grid gap-1 text-sm">
        Perfil
        <select name="role" defaultValue="couple" className={inputClassName}>
          <option value="couple">Noivos</option>
          <option value="admin">Administrador</option>
        </select>
      </label>
      <Button type="submit" disabled={isPending}>
        {isPending ? "Salvando..." : "Adicionar"}
      </Button>
      {errorMessage ? (
        <p role="alert" className="text-sm text-destructive sm:col-span-4">
          {errorMessage}
        </p>
      ) : null}
    </form>
  );
}
