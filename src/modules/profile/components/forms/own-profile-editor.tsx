"use client";

import { useRouter } from "next/navigation";
import { useState } from "react";
import type { GuestProfile } from "@/modules/profile/types";
import { GuestProfileForm } from "./guest-profile-form";

type OwnProfileEditorProps = { profile: GuestProfile };

export function OwnProfileEditor({ profile }: OwnProfileEditorProps) {
  const router = useRouter();
  const [wasSaved, setWasSaved] = useState(false);

  function handleSaved() {
    setWasSaved(true);
    router.refresh();
  }

  return (
    <section className="flex flex-col gap-3 rounded-2xl border border-gold/50 bg-card p-4">
      <h2 className="font-heading text-xl italic">Meus dados</h2>
      <GuestProfileForm profile={profile} submitLabel="Salvar alterações" onSaved={handleSaved} />
      {wasSaved ? <p role="status" className="text-sm">Dados salvos com sucesso.</p> : null}
    </section>
  );
}
