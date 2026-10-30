import { formatDateTimeInSaoPaulo } from "@/shared/lib/dates";
import { describeRsvpStatus } from "../lib/rsvp-status-label";
import type { GuestProfile } from "../types";
import { OwnProfileEditor } from "./own-profile-editor";
import { ProfileFields } from "./profile-fields";

type GuestProfileViewProps = { profile: GuestProfile };

export function GuestProfileView({ profile }: GuestProfileViewProps) {
  const fields = [
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
      <OwnProfileEditor profile={profile} />
      <ProfileFields fields={fields} />
      <p className="text-base">
        O número de lugares e o código de acesso são definidos pelos noivos.
      </p>
    </div>
  );
}
