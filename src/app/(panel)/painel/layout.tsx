import type { ReactNode } from "react";
import { requireRouteAccess } from "@/modules/auth/controllers/require-route-access";
import { ReviewTourButton } from "@/modules/tour/components/launch/review-tour-button";
import { TourProvider } from "@/modules/tour/components/launch/tour-provider";
import { shouldAutoOpenTourQuery } from "@/modules/tour/controllers/queries/tour.queries";
import { AppShell } from "@/shared/ui/components/app-shell";
import { panelNavItemsFor } from "@/shared/ui/components/nav-items";

type PanelLayoutProps = { children: ReactNode };

export default async function PanelLayout({ children }: PanelLayoutProps) {
  const user = await requireRouteAccess("/painel");
  const shouldAutoOpenTour = await shouldAutoOpenTourQuery();
  return (
    <TourProvider role={user.role} shouldAutoOpen={shouldAutoOpenTour}>
      <AppShell
        title="Painel dos noivos"
        homeHref="/painel"
        items={panelNavItemsFor(user.role)}
        navActions={<ReviewTourButton className="min-h-11 w-full px-4 text-lg underline-offset-4 hover:underline xl:px-3 xl:text-base" />}
      >
        {children}
      </AppShell>
    </TourProvider>
  );
}
