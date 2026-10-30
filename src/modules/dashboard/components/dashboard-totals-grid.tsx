import { buildDashboardCards } from "../lib/build-dashboard-cards";
import type { DashboardTotals } from "../types";
import { DashboardCardLink } from "./dashboard-card-link";

type DashboardTotalsGridProps = { totals: DashboardTotals };

export function DashboardTotalsGrid({ totals }: DashboardTotalsGridProps) {
  return (
    <ul aria-label="Totais" className="grid gap-3 sm:grid-cols-2 lg:grid-cols-3">
      {buildDashboardCards(totals).map((card) => (
        <li key={card.href}>
          <DashboardCardLink card={card} />
        </li>
      ))}
    </ul>
  );
}
