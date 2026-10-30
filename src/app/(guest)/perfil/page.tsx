import { GuestProfileView } from "@/modules/profile/components/guest-profile-view";
import { requireGuestPageAccess } from "@/modules/profile/controllers/guest-page-access";
import { getMyGuestProfileQuery } from "@/modules/profile/controllers/profile.queries";
import { PageHeading } from "@/shared/ui/components/page-heading";

export const dynamic = "force-dynamic";

export default async function GuestProfilePage() {
  await requireGuestPageAccess();
  const profile = await getMyGuestProfileQuery();

  return (
    <div className="mx-auto flex max-w-3xl flex-col gap-6">
      <PageHeading title="Meu perfil" description="Seus dados e o código que abre a porta do nosso site." />
      <GuestProfileView profile={profile} />
    </div>
  );
}
