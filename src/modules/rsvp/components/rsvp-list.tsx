import { formatDateTimeInSaoPaulo } from "@/shared/lib/dates";
import type { RsvpListItem, RsvpStatus } from "../types";

const statusLabels: Record<RsvpStatus, string> = {
  pending: "Pendente",
  going: "Confirmado",
  declined: "Recusou",
};

export function RsvpList({ items }: { items: RsvpListItem[] }) {
  return (
    <ul className="flex flex-col divide-y divide-wine/10 rounded-xl bg-paper-dark/40">
      {items.map((item) => (
        <li key={item.guestId} className="flex flex-wrap items-center justify-between gap-2 p-3">
          <div>
            <p className="text-wine">{item.guestName}</p>
            <p className="text-xs text-wine/70">
              {item.companionsCount} de {Math.max(item.seats - 1, 0)} acompanhantes
              {item.respondedAt ? ` · ${formatDateTimeInSaoPaulo(item.respondedAt)}` : ""}
            </p>
          </div>
          <span className="rounded-full bg-blush px-3 py-1 text-xs text-wine">{statusLabels[item.status]}</span>
        </li>
      ))}
    </ul>
  );
}
