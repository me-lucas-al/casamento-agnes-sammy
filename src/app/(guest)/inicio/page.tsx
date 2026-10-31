import { listMyContributionsQuery } from "@/modules/contributions/controllers/queries/contributions.queries";
import { getEventSettingsQuery } from "@/modules/event/controllers/queries/event.queries";
import { GuestGreeting } from "@/modules/profile/components/home/guest-greeting";
import { HomeSummary } from "@/modules/profile/components/home/home-summary";
import { ShortcutLinks } from "@/modules/profile/components/home/shortcut-links";
import { requireGuestPageAccess } from "@/modules/profile/controllers/guards/guest-page-access";
import { getMyGuestProfileQuery } from "@/modules/profile/controllers/queries/profile.queries";
import { countActiveContributions } from "@/modules/profile/lib/count-active-contributions";

export const dynamic = "force-dynamic";

export default async function GuestHomePage() {
  await requireGuestPageAccess();
  const [profile, settings, contributions] = await Promise.all([
    getMyGuestProfileQuery(),
    getEventSettingsQuery(),
    listMyContributionsQuery(),
  ]);

  return (
    <div className="mx-auto flex max-w-3xl flex-col gap-6">
      <GuestGreeting guestName={profile.name} eventAtIso={settings.eventAt} />
      <HomeSummary rsvpStatus={profile.rsvpStatus} contributionsCount={countActiveContributions(contributions)} />
      <ShortcutLinks />
    </div>
  );
}
