import { redirect } from "next/navigation";
import type { ReactNode } from "react";
import { getSessionUser } from "@/modules/auth/controllers/get-session-user";
import { AppShell } from "@/shared/ui/components/app-shell";
import { panelNavItemsFor } from "@/shared/ui/components/nav-items";

type PanelLayoutProps = { children: ReactNode };

export default async function PanelLayout({ children }: PanelLayoutProps) {
  const user = await getSessionUser();
  if (!user) redirect("/admin/entrar");
  if (user.role === "guest") redirect("/presentes");
  return (
    <AppShell title="Painel dos noivos" items={panelNavItemsFor(user.role)}>
      {children}
    </AppShell>
  );
}
