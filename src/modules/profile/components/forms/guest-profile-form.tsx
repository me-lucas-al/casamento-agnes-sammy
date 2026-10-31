"use client";

import { useId, useState, useTransition } from "react";
import { CompanionFields } from "@/modules/rsvp/components/companion-fields";
import type { Companion } from "@/modules/rsvp/types";
import { Button } from "@/shared/ui/primitives/button";
import { FormField, textInputClassName } from "@/shared/ui/forms/form-field";
import { updateMyProfileAction } from "@/modules/profile/controllers/actions/profile.actions";
import type { GuestProfile } from "@/modules/profile/types";

type GuestProfileFormProps = {
  profile: GuestProfile;
  submitLabel: string;
  onSaved: () => void;
};

export function GuestProfileForm({ profile, submitLabel, onSaved }: GuestProfileFormProps) {
  const idPrefix = useId();
  const [isPending, startTransition] = useTransition();
  const [name, setName] = useState(profile.name);
  const [phone, setPhone] = useState(profile.phone ?? "");
  const [email, setEmail] = useState(profile.email ?? "");
  const [relatives, setRelatives] = useState<Companion[]>(profile.relatives);
  const [errorMessage, setErrorMessage] = useState<string | null>(null);
  const maxRelatives = Math.max(profile.seats - 1, 0);

  function submit() {
    setErrorMessage(null);
    startTransition(async () => {
      const result = await updateMyProfileAction({ name, phone, email, relatives });
      if (!result.ok) return setErrorMessage(result.error);
      onSaved();
    });
  }

  return (
    <form
      onSubmit={(event) => {
        event.preventDefault();
        submit();
      }}
      className="flex flex-col gap-4"
    >
      <FormField label="Nome" htmlFor={`${idPrefix}-name`}>
        <input id={`${idPrefix}-name`} required minLength={2} maxLength={120} value={name} autoComplete="name"
          onChange={(event) => setName(event.target.value)} className={textInputClassName} />
      </FormField>
      <FormField label="Telefone" htmlFor={`${idPrefix}-phone`} hint="Com DDD, para os noivos falarem com você.">
        <input id={`${idPrefix}-phone`} type="tel" required value={phone} autoComplete="tel"
          onChange={(event) => setPhone(event.target.value)} className={textInputClassName} />
      </FormField>
      <FormField label="E-mail" htmlFor={`${idPrefix}-email`}>
        <input id={`${idPrefix}-email`} type="email" required maxLength={200} value={email} autoComplete="email"
          onChange={(event) => setEmail(event.target.value)} className={textInputClassName} />
      </FormField>
      {maxRelatives > 0 ? (
        <CompanionFields companions={relatives} maxCompanions={maxRelatives} onChange={setRelatives} />
      ) : null}
      {errorMessage ? <p role="alert" className="text-sm text-crimson">{errorMessage}</p> : null}
      <Button type="submit" size="lg" disabled={isPending} className="bg-rose text-white">
        {isPending ? "Salvando..." : submitLabel}
      </Button>
    </form>
  );
}
