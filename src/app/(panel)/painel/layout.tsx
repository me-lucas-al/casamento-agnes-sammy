import { redirect } from "next/navigation";
import type { ReactNode } from "react";
import { getSessionUser } from "@/modules/auth/controllers/get-session-user";
import { ReviewTourButton } from "@/modules/tour/components/review-tour-button";
import { TourProvider } from "@/modules/tour/components/tour-provider";
import { shouldAutoOpenTourQuery } from "@/modules/tour/controllers/tour.queries";
import { AppShell } from "@/shared/ui/components/app-shell";
import { panelNavItemsFor } from "@/shared/ui/components/nav-items";

type PanelLayoutProps = { children: ReactNode };

export default async function PanelLayout({ children }: PanelLayoutProps) {
  const user = await getSessionUser();
  if (!user) redirect("/admin/entrar");
  if (user.role === "guest") redirect("/presentes");
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
