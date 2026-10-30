import { formatCentsAsBrl } from "@/shared/lib/money";
import type { DashboardTotals } from "../types";

export type DashboardCard = {
  href: string;
  label: string;
  value: string;
  details: string[];
};

function pluralize(total: number, singular: string, plural: string): string {
  return `${total} ${total === 1 ? singular : plural}`;
}

export function buildDashboardCards(totals: DashboardTotals): DashboardCard[] {
  const { reservations, pendingPayments, attendance } = totals;
  return [
    {
      href: "/painel/presentes",
      label: "Reservas",
      value: String(reservations.reserved + reservations.confirmed),
      details: [
        pluralize(reservations.reserved, "reservada", "reservadas"),
        pluralize(reservations.confirmed, "confirmada", "confirmadas"),
      ],
    },
    {
      href: "/painel/pagamentos",
      label: "Pagamentos pendentes",
      value: formatCentsAsBrl(pendingPayments.amountCents),
      details: [pluralize(pendingPayments.count, "pagamento a conferir", "pagamentos a conferir")],
    },
    {
      href: "/painel/presencas",
      label: "Presenças",
      value: pluralize(attendance.attendingPeople, "pessoa", "pessoas"),
      details: [
        `${attendance.going} indo`,
        `${attendance.declined} recusaram`,
        `${attendance.pending} pendentes`,
      ],
    },
    {
      href: "/painel/recados",
      label: "Recados pendentes",
      value: String(totals.pendingMessages),
      details: ["aguardando moderação"],
    },
    {
      href: "/painel/fotos",
      label: "Fotos pendentes",
      value: String(totals.pendingPhotos),
      details: ["aguardando moderação"],
    },
  ];
}
