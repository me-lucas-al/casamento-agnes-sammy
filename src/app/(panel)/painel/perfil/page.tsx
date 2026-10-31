import { StaffProfileView } from "@/modules/profile/components/views/staff-profile-view";
import { getMyStaffProfileQuery } from "@/modules/profile/controllers/queries/profile.queries";
import { PageHeading } from "@/shared/ui/layout/page-heading";

export const dynamic = "force-dynamic";

export default async function StaffProfilePage() {
  const profile = await getMyStaffProfileQuery();

  return (
    <div className="mx-auto flex max-w-3xl flex-col gap-6">
      <PageHeading title="Meu perfil" description="Seus dados de acesso ao painel." align="start" />
      <StaffProfileView profile={profile} />
    </div>
  );
}
