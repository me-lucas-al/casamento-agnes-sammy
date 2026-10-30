import Link from "next/link";
import { getSessionUser } from "@/modules/auth/controllers/get-session-user";
import { panelNavItemsFor } from "@/shared/ui/components/nav-items";

export default async function PanelHomePage() {
  const user = await getSessionUser();
  const items = panelNavItemsFor(user?.role ?? "couple");
  return (
    <section className="flex flex-col gap-4">
      <h1 className="font-heading text-3xl italic">Bem-vindos ao painel</h1>
      <ul className="grid gap-3 sm:grid-cols-2 lg:grid-cols-3">
        {items.map((item) => (
          <li key={item.href}>
            <Link
              href={item.href}
              className="block rounded-xl border border-gold/50 bg-card px-4 py-5 text-lg transition-colors hover:bg-blush"
            >
              {item.label}
            </Link>
          </li>
        ))}
      </ul>
    </section>
  );
}
