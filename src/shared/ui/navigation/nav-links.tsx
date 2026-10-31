"use client";

import { Menu, X } from "lucide-react";
import Link from "next/link";
import { usePathname } from "next/navigation";
import { useState, type ReactNode } from "react";
import { cn } from "@/shared/lib/styling/utils";

export type NavItem = { href: string; label: string };

type NavLinksProps = { items: readonly NavItem[]; children?: ReactNode };

export function NavLinks({ items, children }: NavLinksProps) {
  const pathname = usePathname();
  const [isOpen, setIsOpen] = useState(false);
  const MenuIcon = isOpen ? X : Menu;
  return (
    <>
      <button
        type="button"
        aria-expanded={isOpen}
        aria-controls="main-navigation"
        onClick={() => setIsOpen((current) => !current)}
        className="inline-flex items-center gap-2 rounded-full border border-gold px-4 text-base xl:hidden"
      >
        <MenuIcon aria-hidden className="size-5" />
        {isOpen ? "Fechar" : "Menu"}
      </button>
      <nav
        id="main-navigation"
        aria-label="Navegação principal"
        className={cn(
          "absolute inset-x-0 top-full z-30 flex-col gap-1 border-b border-gold/40 bg-paper px-4 py-3 shadow-lg",
          "xl:static xl:flex xl:flex-row xl:items-center xl:gap-0.5 xl:border-0 xl:bg-transparent xl:p-0 xl:shadow-none",
          isOpen ? "flex" : "hidden",
        )}
      >
        {items.map((item) => {
          const isActive = pathname === item.href || pathname.startsWith(`${item.href}/`);
          return (
            <Link
              key={item.href}
              href={item.href}
              aria-current={isActive ? "page" : undefined}
              onClick={() => setIsOpen(false)}
              className={cn(
                "flex min-h-11 items-center whitespace-nowrap rounded-full px-4 text-lg transition-colors hover:bg-blush xl:px-3 xl:text-base",
                isActive && "bg-rose text-white hover:bg-rose",
              )}
            >
              {item.label}
            </Link>
          );
        })}
        <div className="mt-1 flex flex-col border-t border-gold/30 pt-1 xl:ml-2 xl:flex-row xl:items-center xl:mt-0 xl:border-0 xl:pt-0">{children}</div>
      </nav>
    </>
  );
}
