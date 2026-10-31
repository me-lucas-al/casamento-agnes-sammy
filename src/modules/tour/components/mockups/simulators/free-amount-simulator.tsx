"use client";

import { useState } from "react";
import { GiftStatusBadge } from "@/modules/gifts/components/cards/gift-status-badge";
import { formatCentsAsBrl } from "@/shared/lib/money";
import { buildAmountAvailability } from "../parts/mock-availability";

const GOAL_CENTS = 100000;
const SUGGESTED_AMOUNTS_CENTS = [5000, 10000, 20000];

export function FreeAmountSimulator() {
  const [raisedCents, setRaisedCents] = useState(0);
  const percent = Math.min(Math.round((raisedCents / GOAL_CENTS) * 100), 100);
  return (
    <div className="flex flex-col gap-2">
      <p className="text-base">
        Meta <strong>{formatCentsAsBrl(GOAL_CENTS)}</strong>. Cada convidado escolhe o valor, a partir do mínimo que
        vocês definem. Toque para simular:
      </p>
      <div className="flex flex-wrap gap-2">
        {SUGGESTED_AMOUNTS_CENTS.map((amountCents) => (
          <button
            key={amountCents}
            type="button"
            onClick={() => setRaisedCents((current) => Math.min(current + amountCents, GOAL_CENTS))}
            className="rounded-full border border-gold/70 bg-paper px-4 text-base hover:bg-blush active:scale-95"
          >
            + {formatCentsAsBrl(amountCents)}
          </button>
        ))}
        <button type="button" onClick={() => setRaisedCents(0)} className="rounded-full px-3 text-base underline">
          Zerar
        </button>
      </div>
      <div className="h-2 overflow-hidden rounded-full bg-blush">
        <div className="h-full bg-rose transition-all duration-500" style={{ width: `${percent}%` }} />
      </div>
      <div aria-live="polite" className="flex flex-wrap items-center gap-2 text-base">
        O convidado vê: <GiftStatusBadge availability={buildAmountAvailability(GOAL_CENTS, raisedCents)} />
      </div>
    </div>
  );
}
