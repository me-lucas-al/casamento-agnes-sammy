"use client";

import { createGuestAction } from "../controllers/actions/guest.actions";
import { GuestForm } from "./guest-form";

export function CreateGuestPanel() {
  return (
    <section className="rounded-xl border p-4">
      <h2 className="mb-3 font-semibold">Novo convidado</h2>
      <GuestForm submitLabel="Adicionar" onSubmit={createGuestAction} />
    </section>
  );
}
