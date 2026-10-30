import { formatDateTimeInSaoPaulo } from "@/shared/lib/dates";
import type { RsvpListItem, RsvpStatus } from "../types";
import { RsvpRowActions } from "./rsvp-row-actions";

const statusLabels: Record<RsvpStatus, string> = {
  pending: "Pendente",
  going: "Confirmado",
  declined: "Recusou",
};

export function RsvpList({ items }: { items: RsvpListItem[] }) {
  return (
    <ul className="flex flex-col divide-y divide-wine/10 rounded-xl bg-paper-dark/40">
      {items.map((item) => (
        <li key={item.guestId} className="flex flex-wrap items-start justify-between gap-3 p-3">
          <div className="min-w-0">
            <p className="break-words text-wine">{item.guestName}</p>
            <p className="text-xs text-wine/70">
              {item.companionsCount} de {Math.max(item.seats - 1, 0)} acompanhantes
              {item.respondedAt ? ` · ${formatDateTimeInSaoPaulo(item.respondedAt)}` : ""}
            </p>
            <span className="mt-1 inline-block rounded-full bg-blush px-3 py-1 text-xs text-wine">
              {statusLabels[item.status]}
            </span>
          </div>
          <RsvpRowActions guestId={item.guestId} />
        </li>
      ))}
    </ul>
  );
}
