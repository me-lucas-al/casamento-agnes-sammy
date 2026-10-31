import type { ReactNode } from "react";
import { requireRouteAccess } from "@/modules/auth/controllers/session/require-route-access";
import { FirstAccessModal } from "@/modules/profile/components/access/first-access-modal";
import { getFirstAccessProfileQuery } from "@/modules/profile/controllers/queries/profile.queries";
import { AppShell } from "@/shared/ui/components/app-shell";
import { GUEST_NAV_ITEMS } from "@/shared/ui/components/nav-items";

type GuestLayoutProps = { children: ReactNode };

export default async function GuestLayout({ children }: GuestLayoutProps) {
  await requireRouteAccess("/inicio");
  const firstAccessProfile = await getFirstAccessProfileQuery();
  return (
    <AppShell title="Agnes & Sammy" homeHref="/inicio" items={GUEST_NAV_ITEMS} isDecorated>
      {children}
      {firstAccessProfile ? <FirstAccessModal profile={firstAccessProfile} /> : null}
    </AppShell>
  );
}
