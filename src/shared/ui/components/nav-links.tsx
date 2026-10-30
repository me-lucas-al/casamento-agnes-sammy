"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";
import { useState } from "react";
import { cn } from "@/shared/lib/utils";

export type NavItem = { href: string; label: string };

type NavLinksProps = { items: readonly NavItem[] };

export function NavLinks({ items }: NavLinksProps) {
  const pathname = usePathname();
  const [isOpen, setIsOpen] = useState(false);
  return (
    <div className="flex flex-col gap-2 md:flex-row md:items-center">
      <button
        type="button"
        aria-expanded={isOpen}
        aria-controls="main-navigation"
        onClick={() => setIsOpen((current) => !current)}
        className="self-start rounded-full border border-gold/60 px-4 py-1.5 text-base md:hidden"
      >
        {isOpen ? "Fechar menu" : "Menu"}
      </button>
      <nav
        id="main-navigation"
        aria-label="Navegação principal"
        className={cn("flex-col gap-1 md:flex md:flex-row md:flex-wrap", isOpen ? "flex" : "hidden")}
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
                "rounded-full px-3 py-2 text-base transition-colors hover:bg-blush md:py-1.5",
                isActive && "bg-rose text-white hover:bg-rose",
              )}
            >
              {item.label}
            </Link>
          );
        })}
      </nav>
    </div>
  );
}
