import { StaffProfileView } from "@/modules/profile/components/staff-profile-view";
import { getMyStaffProfileQuery } from "@/modules/profile/controllers/profile.queries";

export const dynamic = "force-dynamic";

export default async function StaffProfilePage() {
  const profile = await getMyStaffProfileQuery();

  return (
    <div className="mx-auto flex max-w-3xl flex-col gap-6">
      <h1 className="font-heading text-3xl italic text-wine">Meu perfil</h1>
      <StaffProfileView profile={profile} />
    </div>
  );
}
