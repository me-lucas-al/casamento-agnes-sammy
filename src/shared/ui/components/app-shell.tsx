import type { ReactNode } from "react";
import { signOutAction } from "@/modules/auth/controllers/sign-in.actions";
import { NavLinks, type NavItem } from "./nav-links";

type AppShellProps = {
  title: string;
  items: readonly NavItem[];
  children: ReactNode;
};

export function AppShell({ title, items, children }: AppShellProps) {
  return (
    <div className="flex min-h-screen flex-col">
      <header className="border-b border-gold/40 bg-paper-dark/60">
        <div className="mx-auto flex max-w-5xl flex-col gap-3 px-4 py-3 md:flex-row md:items-center md:justify-between">
          <p className="font-heading text-xl italic">{title}</p>
          <NavLinks items={items} />
          <form action={signOutAction}>
            <button type="submit" className="text-sm underline-offset-4 hover:underline">
              Sair
            </button>
          </form>
        </div>
      </header>
      <main className="mx-auto w-full min-w-0 max-w-5xl flex-1 px-4 py-6">{children}</main>
    </div>
  );
}
