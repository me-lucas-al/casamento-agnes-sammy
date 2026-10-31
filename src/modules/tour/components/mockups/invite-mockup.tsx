"use client";

import { MessageCircle, RefreshCw } from "lucide-react";
import { useState } from "react";
import { buildGuestInviteMessage } from "@/modules/guests/lib/whatsapp-link";
import { MockField } from "./mock-field";
import { PanelWindow } from "./panel-window";

const EXAMPLE_CODES = ["K7M2QX9P", "R4T8WH3N", "M9C6ZD2F"] as const;
const EXAMPLE_BASE_URL = "https://agnesesammy.com.br";
const GUEST_NAME = "Tia Marta";

export function InviteMockup() {
  const [codeIndex, setCodeIndex] = useState(0);
  const code = EXAMPLE_CODES[codeIndex];
  const message = buildGuestInviteMessage({ baseUrl: EXAMPLE_BASE_URL, guestName: GUEST_NAME, code });
  return (
    <PanelWindow title="Convidados" label="Exemplo de cadastro de convidado e mensagem de WhatsApp">
      <div className="grid grid-cols-[minmax(0,1fr)_5rem] gap-2">
        <MockField label="Nome" value={GUEST_NAME} />
        <MockField label="Vagas" value="3" />
      </div>
      <div className="flex flex-wrap items-center justify-between gap-2 rounded-xl bg-blush px-3 py-2">
        <div className="flex flex-col">
          <span className="text-sm font-semibold">Código de acesso (8 caracteres)</span>
          <span aria-live="polite" className="font-display text-2xl tracking-[0.2em] text-crimson">
            {code}
          </span>
        </div>
        <button
          type="button"
          onClick={() => setCodeIndex((current) => (current + 1) % EXAMPLE_CODES.length)}
          className="inline-flex items-center gap-1.5 rounded-full border border-wine/40 bg-paper px-4 text-base hover:bg-white active:scale-95"
        >
          <RefreshCw aria-hidden className="size-4" />
          Gerar novo código
        </button>
      </div>
      <div className="flex flex-col gap-1.5">
        <span className="inline-flex w-fit items-center gap-1.5 rounded-full bg-wine px-4 py-1.5 text-base text-paper">
          <MessageCircle aria-hidden className="size-4" />
          Enviar por WhatsApp
        </span>
        <p className="rounded-2xl rounded-tl-sm bg-white px-3 py-2 text-base leading-snug shadow-sm">{message}</p>
      </div>
    </PanelWindow>
  );
}
