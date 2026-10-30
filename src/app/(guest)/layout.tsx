import { redirect } from "next/navigation";
import type { ReactNode } from "react";
import { getSessionUser } from "@/modules/auth/controllers/get-session-user";
import { AppShell } from "@/shared/ui/components/app-shell";
import { GUEST_NAV_ITEMS } from "@/shared/ui/components/nav-items";

type GuestLayoutProps = { children: ReactNode };

export default async function GuestLayout({ children }: GuestLayoutProps) {
  const user = await getSessionUser();
  if (!user) redirect("/entrar");
  return (
    <AppShell title="Agnes & Sammy" items={GUEST_NAV_ITEMS}>
      {children}
    </AppShell>
  );
}
