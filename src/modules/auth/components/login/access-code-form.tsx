"use client";

import { useActionState, useState, type ChangeEvent } from "react";
import { KeyRound } from "lucide-react";
import { ACCESS_CODE_LENGTH, normalizeAccessCode } from "../../lib/access-code";
import { signInWithGuestCodeAction, type SignInFormState } from "../../controllers/sign-in.actions";
import { SubmitButton } from "./submit-button";

type AccessCodeFormProps = { initialCode: string };

const INITIAL_STATE: SignInFormState = { error: null };

export function AccessCodeForm({ initialCode }: AccessCodeFormProps) {
  const [state, formAction, isPending] = useActionState(signInWithGuestCodeAction, INITIAL_STATE);
  const [code, setCode] = useState(() => normalizeAccessCode(initialCode));
  const describedBy = state.error ? "access-code-error" : "access-code-help";

  function handleChange(event: ChangeEvent<HTMLInputElement>) {
    setCode(normalizeAccessCode(event.target.value));
  }

  return (
    <form action={formAction} className="flex flex-col gap-2" noValidate>
      <label htmlFor="access-code" className="text-lg font-semibold">
        Código de acesso
      </label>
      <div className="relative">
        <KeyRound aria-hidden className="pointer-events-none absolute left-3 top-1/2 size-5 -translate-y-1/2 text-rose" />
        <input
          id="access-code"
          name="code"
          value={code}
          onChange={handleChange}
          required
          autoComplete="off"
          autoCapitalize="characters"
          autoCorrect="off"
          spellCheck={false}
          inputMode="text"
          maxLength={ACCESS_CODE_LENGTH + 4}
          placeholder="K7M2QX9P"
          aria-invalid={Boolean(state.error)}
          aria-describedby={describedBy}
          className="w-full rounded-[0.875rem] border bg-white px-3 py-2 pl-11 text-center font-sans text-2xl font-semibold uppercase tracking-[0.3em] text-wine placeholder:font-normal placeholder:tracking-[0.3em] placeholder:text-wine/45"
        />
      </div>
      {state.error ? (
        <p id="access-code-error" role="alert" className="text-base font-semibold text-crimson">
          {state.error}
        </p>
      ) : (
        <p id="access-code-help" className="text-[15px] leading-snug text-muted-foreground">
          Seu código está no convite que você recebeu.
        </p>
      )}
      <SubmitButton isPending={isPending} pendingLabel="Entrando...">
        Entrar
      </SubmitButton>
    </form>
  );
}
