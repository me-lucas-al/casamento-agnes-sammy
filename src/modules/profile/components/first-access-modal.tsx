"use client";

import { useRouter } from "next/navigation";
import { useEffect, useRef } from "react";
import type { GuestProfile } from "../types";
import { GuestProfileForm } from "./guest-profile-form";

type FirstAccessModalProps = { profile: GuestProfile };

export function FirstAccessModal({ profile }: FirstAccessModalProps) {
  const router = useRouter();
  const dialogRef = useRef<HTMLDialogElement>(null);
  const isSavedRef = useRef(false);

  useEffect(() => {
    const dialog = dialogRef.current;
    if (dialog && !dialog.open) dialog.showModal();
  }, []);

  function closeAndRefresh() {
    isSavedRef.current = true;
    dialogRef.current?.close();
    router.refresh();
  }

  function reopenUntilSaved() {
    const dialog = dialogRef.current;
    if (!isSavedRef.current && dialog && !dialog.open) dialog.showModal();
  }

  return (
    <dialog
      ref={dialogRef}
      aria-labelledby="first-access-title"
      onCancel={(event) => event.preventDefault()}
      onClose={reopenUntilSaved}
      className="m-auto max-h-[90dvh] w-[calc(100%-2rem)] max-w-lg overflow-y-auto rounded-2xl border border-gold/50 bg-paper p-6 text-wine backdrop:bg-wine/60"
    >
      <h2 id="first-access-title" className="font-serif text-2xl italic">
        Bem-vindo(a)! Conte um pouco sobre você
      </h2>
      <p className="mb-4 mt-1 text-base">
        Confirme seus dados para os noivos entrarem em contato e organizarem a festa.
      </p>
      <GuestProfileForm profile={profile} submitLabel="Salvar e entrar" onSaved={closeAndRefresh} />
    </dialog>
  );
}
