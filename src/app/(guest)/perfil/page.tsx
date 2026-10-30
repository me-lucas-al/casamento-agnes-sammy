import { GuestProfileView } from "@/modules/profile/components/guest-profile-view";
import { requireGuestPageAccess } from "@/modules/profile/controllers/guest-page-access";
import { getMyGuestProfileQuery } from "@/modules/profile/controllers/profile.queries";

export const dynamic = "force-dynamic";

export default async function GuestProfilePage() {
  await requireGuestPageAccess();
  const profile = await getMyGuestProfileQuery();

  return (
    <div className="mx-auto flex max-w-3xl flex-col gap-6">
      <h1 className="text-center font-heading text-4xl italic text-wine">Meu perfil</h1>
      <GuestProfileView profile={profile} />
    </div>
  );
}
