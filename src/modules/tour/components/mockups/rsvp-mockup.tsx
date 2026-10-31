import { MockBadge } from "./mock-badge";
import { PanelWindow } from "./panel-window";

const TOTALS = [
  { label: "Vão", value: "24", tone: "text-rose" },
  { label: "Não vão", value: "3", tone: "text-wine" },
  { label: "Sem resposta", value: "11", tone: "text-wine" },
  { label: "Pessoas", value: "41", tone: "text-crimson" },
] as const;

const GUEST_ROWS = [
  { name: "Tia Marta", detail: "3 vagas, 3 confirmadas", badge: <MockBadge tone="success">Vai</MockBadge> },
  { name: "Primo Caio", detail: "2 vagas", badge: <MockBadge tone="warning">Pendente</MockBadge> },
  { name: "Dona Lúcia", detail: "1 vaga", badge: <MockBadge tone="danger">Não vai</MockBadge> },
] as const;

export function RsvpMockup() {
  return (
    <PanelWindow title="Presenças" label="Exemplo da tela de presenças do painel">
      <dl className="grid grid-cols-4 gap-1.5 text-center">
        {TOTALS.map(({ label, value, tone }) => (
          <div key={label} className="flex flex-col rounded-xl bg-blush px-1 py-2">
            <dd className={`font-display text-2xl tabular-nums ${tone}`}>{value}</dd>
            <dt className="text-sm leading-tight">{label}</dt>
          </div>
        ))}
      </dl>
      <ul className="flex flex-col gap-1.5">
        {GUEST_ROWS.map(({ name, detail, badge }) => (
          <li key={name} className="flex items-center justify-between gap-2 rounded-xl border border-gold/40 bg-paper px-3 py-2">
            <div className="flex min-w-0 flex-col">
              <span className="truncate text-base font-semibold leading-tight">{name}</span>
              <span className="text-sm">{detail}</span>
            </div>
            {badge}
          </li>
        ))}
      </ul>
    </PanelWindow>
  );
}
