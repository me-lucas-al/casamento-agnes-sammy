import { formatDateTimeInSaoPaulo } from "@/shared/lib/dates";
import { buildGuestInviteUrl, buildWhatsappShareLink } from "../lib/whatsapp-link";
import type { GuestListItem, RsvpStatus } from "../types";
import { GuestRowActions } from "./guest-row-actions";

const rsvpLabels: Record<RsvpStatus, string> = {
  pending: "Pendente",
  going: "Confirmado",
  declined: "Recusou",
};

type GuestsTableProps = {
  guests: GuestListItem[];
  baseUrl: string;
};

export function GuestsTable({ guests, baseUrl }: GuestsTableProps) {
  return (
    <ul className="grid gap-3">
      {guests.map((guest) => (
        <li key={guest.id} className="grid gap-3 rounded-xl border p-4 lg:grid-cols-[1.5fr_1fr_1.5fr]">
          <div>
            <p className="font-semibold">{guest.name}</p>
            <p className="text-sm text-muted-foreground">
              {guest.phone ?? "Sem telefone"} · {guest.seats} {guest.seats === 1 ? "vaga" : "vagas"}
            </p>
            {guest.email ? <p className="break-all text-sm text-muted-foreground">{guest.email}</p> : null}
          </div>
          <div className="text-sm">
            <p>
              Código: <span className="font-mono font-semibold">{guest.code}</span>
            </p>
            <p>Presença: {rsvpLabels[guest.rsvpStatus]}</p>
            <p className="text-muted-foreground">
              Último acesso: {guest.lastAccessAt ? formatDateTimeInSaoPaulo(guest.lastAccessAt) : "nunca"}
            </p>
          </div>
          <GuestRowActions
            guest={guest}
            inviteUrl={buildGuestInviteUrl(baseUrl, guest.code)}
            whatsappUrl={buildWhatsappShareLink({
              baseUrl,
              guestName: guest.name,
              code: guest.code,
              phone: guest.phone,
            })}
          />
        </li>
      ))}
    </ul>
  );
}
