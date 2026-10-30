import { formatDateTimeInSaoPaulo } from "@/shared/lib/dates";
import { describeRsvpStatus } from "../lib/rsvp-status-label";
import type { GuestProfile } from "../types";
import { ProfileFields } from "./profile-fields";

type GuestProfileViewProps = { profile: GuestProfile };

export function GuestProfileView({ profile }: GuestProfileViewProps) {
  const fields = [
    { label: "Nome", value: profile.name },
    { label: "Telefone", value: profile.phone ?? "Não informado" },
    { label: "Lugares no convite", value: String(profile.seats) },
    { label: "Código de acesso", value: profile.code },
    { label: "Presença", value: describeRsvpStatus(profile.rsvpStatus) },
    {
      label: "Resposta enviada em",
      value: profile.respondedAt ? formatDateTimeInSaoPaulo(profile.respondedAt) : "Ainda sem resposta",
    },
  ];
  return (
    <div className="flex flex-col gap-4">
      <ProfileFields fields={fields} />
      <p className="text-base">
        Para alterar seus dados, fale com os noivos. Você pode atualizar apenas sua presença e seus presentes.
      </p>
    </div>
  );
}
