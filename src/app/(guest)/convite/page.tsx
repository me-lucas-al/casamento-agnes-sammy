import { getEventSettingsQuery } from "@/modules/event/controllers/event.queries";
import { AccessCodeCard } from "@/modules/profile/components/access-code-card";
import { PersonalInvitation } from "@/modules/profile/components/personal-invitation";
import { requireGuestPageAccess } from "@/modules/profile/controllers/guest-page-access";
import { getMyGuestProfileQuery } from "@/modules/profile/controllers/profile.queries";
import { buildInvitationLink } from "@/modules/profile/lib/invitation-link";
import { getAppEnv } from "@/shared/config/env";

export const dynamic = "force-dynamic";

export default async function PersonalInvitationPage() {
  await requireGuestPageAccess();
  const [profile, settings] = await Promise.all([getMyGuestProfileQuery(), getEventSettingsQuery()]);
  const invitationLink = buildInvitationLink(getAppEnv().APP_URL, profile.code);

  return (
    <div className="mx-auto flex max-w-3xl flex-col gap-6">
      <PersonalInvitation settings={settings} profile={profile} />
      <AccessCodeCard code={profile.code} invitationLink={invitationLink} />
    </div>
  );
}
