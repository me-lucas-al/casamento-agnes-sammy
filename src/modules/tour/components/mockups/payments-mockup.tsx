"use client";

import { Check } from "lucide-react";
import { useState } from "react";
import { MockBadge } from "./mock-badge";
import { PanelWindow } from "./panel-window";

const STATUS_LEGEND = [
  { badge: <MockBadge tone="warning">Aguardando</MockBadge>, meaning: "reservou e ainda não pagou; vale por 48 horas" },
  { badge: <MockBadge tone="success">Confirmado</MockBadge>, meaning: "vocês viram o Pix e confirmaram" },
  { badge: <MockBadge tone="neutral">Expirado</MockBadge>, meaning: "passou de 48 horas sem confirmação" },
  { badge: <MockBadge tone="danger">Cancelado</MockBadge>, meaning: "o convidado desistiu da reserva" },
] as const;

export function PaymentsMockup() {
  const [isConfirmed, setIsConfirmed] = useState(false);
  return (
    <PanelWindow title="Pagamentos" label="Exemplo da tela de pagamentos do painel">
      <div className="flex flex-wrap items-center justify-between gap-2 rounded-xl border border-gold/50 bg-paper p-3">
        <div className="flex flex-col items-start gap-1">
          <span className="text-base font-semibold">Tia Marta, Lua de mel (1 cota)</span>
          <span className="text-base">R$ 100,00, vence em 36 h</span>
          {isConfirmed ? <MockBadge tone="success">Confirmado</MockBadge> : <MockBadge tone="warning">Aguardando</MockBadge>}
        </div>
        <button
          type="button"
          disabled={isConfirmed}
          onClick={() => setIsConfirmed(true)}
          className="inline-flex items-center gap-1.5 rounded-full bg-rose px-4 text-base font-semibold text-white active:scale-95 disabled:opacity-60"
        >
          <Check aria-hidden className="size-4" />
          Confirmar Pix
        </button>
      </div>
      <p aria-live="polite" className="text-sm font-semibold text-rose">
        {isConfirmed ? "Pronto! A cota aparece como paga na lista." : "Confira o Pix no app do banco e toque em Confirmar."}
      </p>
      <dl className="flex flex-col gap-1.5">
        {STATUS_LEGEND.map(({ badge, meaning }) => (
          <div key={meaning} className="flex flex-wrap items-center gap-x-2 text-base">
            <dt>{badge}</dt>
            <dd className="min-w-0 flex-1 leading-tight">{meaning}</dd>
          </div>
        ))}
      </dl>
    </PanelWindow>
  );
}
