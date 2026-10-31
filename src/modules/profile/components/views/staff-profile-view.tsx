import { signOutAction } from "@/modules/auth/controllers/sign-in.actions";
import type { StaffProfile } from "@/modules/profile/types";
import { ProfileFields } from "../forms/profile-fields";

type StaffProfileViewProps = { profile: StaffProfile };

const ROLE_LABELS = { admin: "Administrador", couple: "Noivos", guest: "Convidado" } as const;

export function StaffProfileView({ profile }: StaffProfileViewProps) {
  const fields = [
    { label: "Nome", value: profile.name },
    { label: "E-mail", value: profile.email },
    { label: "Perfil", value: ROLE_LABELS[profile.role] },
  ];
  return (
    <div className="flex flex-col gap-6">
      <ProfileFields fields={fields} />
      <form action={signOutAction}>
        <button
          type="submit"
          className="rounded-full bg-crimson px-6 py-3 text-lg text-white transition-colors hover:bg-wine"
        >
          Sair da conta
        </button>
      </form>
    </div>
  );
}
