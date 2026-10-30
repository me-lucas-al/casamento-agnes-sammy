import type { ReactNode } from "react";
import { signOutAction } from "@/modules/auth/controllers/sign-in.actions";
import { BrandFooter } from "./brand-footer";
import { BrandMark } from "./brand-mark";
import { FloralCorners } from "./floral-corners";
import { NavLinks, type NavItem } from "./nav-links";

type AppShellProps = {
  title: string;
  homeHref: string;
  items: readonly NavItem[];
  isDecorated?: boolean;
  children: ReactNode;
};

export function AppShell({ title, homeHref, items, isDecorated = false, children }: AppShellProps) {
  return (
    <div className="relative flex min-h-screen flex-col">
      <header className="relative z-30 border-b border-gold/40 bg-paper-dark">
        <div className="mx-auto flex max-w-6xl items-center justify-between gap-4 px-4 py-2">
          <BrandMark title={title} href={homeHref} />
          <NavLinks items={items}>
            <form action={signOutAction}>
              <button
                type="submit"
                className="flex min-h-11 w-full items-center rounded-full px-4 text-lg underline-offset-4 hover:underline xl:px-3 xl:text-base"
              >
                Sair
              </button>
            </form>
          </NavLinks>
        </div>
      </header>
      <div className="relative flex flex-1 flex-col">
        {isDecorated ? <FloralCorners area="top" className="w-24 sm:w-40" /> : null}
        <main className="relative z-10 mx-auto w-full min-w-0 max-w-6xl flex-1 px-4 py-8">{children}</main>
      </div>
      {isDecorated ? <BrandFooter /> : null}
    </div>
  );
}
