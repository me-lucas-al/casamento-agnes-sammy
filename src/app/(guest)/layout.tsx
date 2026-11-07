import type { ReactNode } from "react";
import { requireRouteAccess } from "@/modules/auth/controllers/session/require-route-access";
import { isViewer } from "@/modules/auth/lib/is-viewer";
import { FirstAccessModal } from "@/modules/profile/components/access/first-access-modal";
import { getFirstAccessProfileQuery } from "@/modules/profile/controllers/queries/profile.queries";
import { ViewerModeBanner } from "@/shared/ui/feedback/viewer-mode-banner";
import { AppShell } from "@/shared/ui/layout/app-shell";
import { GUEST_NAV_ITEMS } from "@/shared/ui/navigation/nav-items";

type GuestLayoutProps = { children: ReactNode };

export default async function GuestLayout({ children }: GuestLayoutProps) {
  const user = await requireRouteAccess("/inicio");
  const firstAccessProfile = await getFirstAccessProfileQuery();
  const banner = isViewer(user) ? <ViewerModeBanner switchHref="/painel" switchLabel="Ver o painel dos noivos" /> : null;
  return (
    <AppShell title="Agnes & Sammy" homeHref="/inicio" items={GUEST_NAV_ITEMS} isDecorated banner={banner}>
      {children}
      {firstAccessProfile ? <FirstAccessModal profile={firstAccessProfile} /> : null}
    </AppShell>
  );
}
