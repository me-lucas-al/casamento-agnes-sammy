import { redirect } from "next/navigation";
import type { ReactNode } from "react";
import { getSessionUser } from "@/modules/auth/controllers/get-session-user";
import { FirstAccessModal } from "@/modules/profile/components/first-access-modal";
import { getFirstAccessProfileQuery } from "@/modules/profile/controllers/profile.queries";
import { AppShell } from "@/shared/ui/components/app-shell";
import { GUEST_NAV_ITEMS } from "@/shared/ui/components/nav-items";

type GuestLayoutProps = { children: ReactNode };

export default async function GuestLayout({ children }: GuestLayoutProps) {
  const user = await getSessionUser();
  if (!user) redirect("/");
  const firstAccessProfile = await getFirstAccessProfileQuery();
  return (
    <AppShell title="Agnes & Sammy" homeHref="/inicio" items={GUEST_NAV_ITEMS} isDecorated>
      {children}
      {firstAccessProfile ? <FirstAccessModal profile={firstAccessProfile} /> : null}
    </AppShell>
  );
}
