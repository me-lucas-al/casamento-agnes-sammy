"use client";

import { useActionState } from "react";
import { signInWithGuestCodeAction, type SignInFormState } from "../controllers/sign-in.actions";

type GuestCodeFormProps = { initialCode: string };

const INITIAL_STATE: SignInFormState = { error: null };

export function GuestCodeForm({ initialCode }: GuestCodeFormProps) {
  const [state, formAction, isPending] = useActionState(signInWithGuestCodeAction, INITIAL_STATE);
  return (
    <form action={formAction} className="flex w-full flex-col gap-4">
      <label htmlFor="code" className="text-lg font-semibold">
        Código do convite
      </label>
      <input
        id="code"
        name="code"
        required
        autoComplete="off"
        autoCapitalize="characters"
        maxLength={32}
        defaultValue={initialCode}
        className="rounded-lg border border-border bg-card px-3 py-3 text-center text-2xl uppercase tracking-[0.3em] outline-none focus-visible:ring-2 focus-visible:ring-rose/50"
      />
      {state.error ? (
        <p role="alert" className="text-crimson">
          {state.error}
        </p>
      ) : null}
      <button
        type="submit"
        disabled={isPending}
        className="rounded-full bg-rose px-6 py-3 text-lg text-white transition-colors hover:bg-crimson disabled:opacity-60"
      >
        {isPending ? "Entrando..." : "Entrar"}
      </button>
    </form>
  );
}
