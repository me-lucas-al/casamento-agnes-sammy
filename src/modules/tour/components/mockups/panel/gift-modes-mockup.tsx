"use client";

import { Gift } from "lucide-react";
import { useState } from "react";
import { GiftStatusBadge } from "@/modules/gifts/components/cards/gift-status-badge";
import { formatCentsAsBrl } from "@/shared/lib/money/money";
import { cn } from "@/shared/lib/styling/utils";
import { FreeAmountSimulator } from "../simulators/free-amount-simulator";
import { buildQuotaAvailability } from "../parts/mock-availability";
import { PanelWindow } from "../parts/panel-window";
import { QuotaSimulator } from "../simulators/quota-simulator";
import { SegmentedChoice } from "../parts/segmented-choice";

type GiftMode = "single" | "fixed_quotas" | "free_amount";

const MODE_OPTIONS = [
  { value: "single", label: "Item único" },
  { value: "fixed_quotas", label: "Cotas fixas" },
  { value: "free_amount", label: "Valor livre" },
] as const;

function SingleItemPreview() {
  return (
    <div className="flex flex-col gap-2 text-base">
      <p>
        Um convidado leva o item inteiro por <strong>{formatCentsAsBrl(60000)}</strong>. Depois da reserva, ele sai da
        lista dos outros.
      </p>
      <div className="flex flex-wrap items-center gap-2">
        O convidado vê: <GiftStatusBadge availability={buildQuotaAvailability(1, 0)} />
      </div>
    </div>
  );
}

export function GiftModesMockup() {
  const [mode, setMode] = useState<GiftMode>("fixed_quotas");
  const [isVisible, setIsVisible] = useState(true);
  return (
    <PanelWindow title="Novo presente" label="Exemplo da tela de cadastro de presente">
      <SegmentedChoice ariaLabel="Modo do presente" options={MODE_OPTIONS} value={mode} onChange={setMode} />
      <div className="flex items-center gap-3">
        <span aria-hidden className="flex size-14 shrink-0 items-center justify-center rounded-xl bg-blush text-rose">
          <Gift className="size-7" />
        </span>
        <div className={cn("min-w-0 flex-1 transition-opacity", !isVisible && "opacity-50")}>
          <p className="truncate text-lg font-semibold">Jogo de panelas</p>
          <p className="text-sm text-muted-foreground">Categoria Cozinha, com foto</p>
        </div>
        <button
          type="button"
          role="switch"
          aria-checked={isVisible}
          aria-label="Mostrar para os convidados"
          onClick={() => setIsVisible((current) => !current)}
          className="flex h-11 w-14 shrink-0 items-center justify-center rounded-full"
        >
          <span className={cn("relative h-7 w-12 rounded-full transition-colors", isVisible ? "bg-rose" : "bg-gold/60")}>
            <span
              className={cn("absolute top-1 size-5 rounded-full bg-white transition-all", isVisible ? "left-6" : "left-1")}
            />
          </span>
        </button>
      </div>
      <p aria-live="polite" className="text-sm font-semibold text-rose">
        {isVisible ? "Visível para os convidados" : "Oculto: só vocês veem"}
      </p>
      {mode === "single" ? <SingleItemPreview /> : null}
      {mode === "fixed_quotas" ? <QuotaSimulator /> : null}
      {mode === "free_amount" ? <FreeAmountSimulator /> : null}
    </PanelWindow>
  );
}
