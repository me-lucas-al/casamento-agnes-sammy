"use client";

import { Check, X } from "lucide-react";
import { useState } from "react";
import { MockBadge } from "../parts/mock-badge";
import { PanelWindow } from "../parts/panel-window";

type Verdict = "pending" | "approved" | "rejected";

const VERDICT_BADGES = {
  pending: <MockBadge tone="warning">Pendente</MockBadge>,
  approved: <MockBadge tone="success">Aprovado</MockBadge>,
  rejected: <MockBadge tone="danger">Rejeitado</MockBadge>,
} as const;

const ITEMS = [
  { id: "message", kind: "Recado", text: "Que vocês sejam muito felizes! Beijos da tia Marta." },
  { id: "photo", kind: "Foto", text: "Foto do casal na festa de noivado" },
] as const;

type ModerationRowProps = { kind: string; text: string };

function ModerationRow({ kind, text }: ModerationRowProps) {
  const [verdict, setVerdict] = useState<Verdict>("pending");
  return (
    <li className="flex flex-col gap-2 rounded-xl border border-gold/40 bg-paper p-3">
      <div className="flex items-center justify-between gap-2">
        <span className="text-sm font-semibold uppercase tracking-wide">{kind}</span>
        <span aria-live="polite">{VERDICT_BADGES[verdict]}</span>
      </div>
      <p className="text-base leading-snug">{text}</p>
      <div className="flex gap-2">
        <button
          type="button"
          onClick={() => setVerdict("approved")}
          className="inline-flex items-center gap-1 rounded-full bg-rose px-4 text-base font-semibold text-white active:scale-95"
        >
          <Check aria-hidden className="size-4" />
          Aprovar
        </button>
        <button
          type="button"
          onClick={() => setVerdict("rejected")}
          className="inline-flex items-center gap-1 rounded-full border border-wine/50 px-4 text-base active:scale-95"
        >
          <X aria-hidden className="size-4" />
          Rejeitar
        </button>
      </div>
    </li>
  );
}

export function ModerationMockup() {
  return (
    <PanelWindow title="Recados e fotos" label="Exemplo da moderação de recados e fotos">
      <ul className="flex flex-col gap-2">
        {ITEMS.map((item) => (
          <ModerationRow key={item.id} kind={item.kind} text={item.text} />
        ))}
      </ul>
    </PanelWindow>
  );
}
