"use client";

import { useState } from "react";
import { GiftStatusBadge } from "@/modules/gifts/components/gift-status-badge";
import { formatCentsAsBrl, splitCentsIntoQuotas } from "@/shared/lib/money";
import { cn } from "@/shared/lib/utils";
import { buildQuotaAvailability } from "./mock-availability";

const TOTAL_CENTS = 60000;
const TOTAL_QUOTAS = 6;

export function QuotaSimulator() {
  const [takenIndexes, setTakenIndexes] = useState<readonly number[]>([0, 1]);
  const quotaPrices = splitCentsIntoQuotas(TOTAL_CENTS, TOTAL_QUOTAS);

  function toggleQuota(index: number) {
    setTakenIndexes((current) =>
      current.includes(index) ? current.filter((taken) => taken !== index) : [...current, index],
    );
  }

  return (
    <div className="flex flex-col gap-2">
      <p className="text-base">
        Total <strong>{formatCentsAsBrl(TOTAL_CENTS)}</strong> em {TOTAL_QUOTAS} cotas de{" "}
        <strong>{formatCentsAsBrl(quotaPrices[0])}</strong>. Toque nas cotas para simular reservas:
      </p>
      <div className="grid grid-cols-3 gap-2">
        {quotaPrices.map((price, index) => {
          const isTaken = takenIndexes.includes(index);
          return (
            <button
              key={index}
              type="button"
              aria-pressed={isTaken}
              onClick={() => toggleQuota(index)}
              className={cn(
                "flex flex-col items-center justify-center rounded-xl border px-1 py-1 text-sm transition-all active:scale-95",
                isTaken ? "border-rose bg-rose text-white" : "border-gold/70 bg-paper hover:bg-blush",
              )}
            >
              <span className="font-semibold">Cota {index + 1}</span>
              <span>{isTaken ? "reservada" : formatCentsAsBrl(price)}</span>
            </button>
          );
        })}
      </div>
      <div aria-live="polite" className="flex flex-wrap items-center gap-2 text-base">
        O convidado vê: <GiftStatusBadge availability={buildQuotaAvailability(TOTAL_QUOTAS, takenIndexes.length)} />
      </div>
    </div>
  );
}
