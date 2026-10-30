import Link from "next/link";
import type { DashboardCard } from "../lib/build-dashboard-cards";

type DashboardCardLinkProps = { card: DashboardCard };

export function DashboardCardLink({ card }: DashboardCardLinkProps) {
  return (
    <Link
      href={card.href}
      className="flex min-h-11 flex-col gap-1 rounded-2xl border border-gold/50 bg-card px-4 py-4 transition-colors hover:bg-blush focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-wine"
    >
      <span className="text-base text-muted-foreground">{card.label}</span>
      <span className="font-display text-3xl leading-tight text-wine">{card.value}</span>
      <span className="flex flex-wrap gap-x-3 text-base text-wine">
        {card.details.map((detail) => (
          <span key={detail}>{detail}</span>
        ))}
      </span>
    </Link>
  );
}
