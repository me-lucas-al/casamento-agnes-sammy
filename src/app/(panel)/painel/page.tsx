import { ChevronRight } from "lucide-react";
import Link from "next/link";
import { getSessionUser } from "@/modules/auth/controllers/get-session-user";
import { getDashboardTotalsQuery, getOnboardingStatusQuery } from "@/modules/dashboard/controllers/queries/dashboard.queries";
import { OnboardingCard } from "@/modules/dashboard/components/onboarding-card";
import { DashboardTotalsGrid } from "@/modules/dashboard/components/dashboard-totals-grid";
import { SuggestionsHomeCard } from "@/modules/gift-suggestions/components/suggestions-home-card";
import { ReviewTourButton } from "@/modules/tour/components/review-tour-button";
import { panelNavItemsFor } from "@/shared/ui/components/nav-items";
import { PageHeading } from "@/shared/ui/components/page-heading";

export const dynamic = "force-dynamic";

export default async function PanelHomePage() {
  const [user, totals, onboarding] = await Promise.all([
    getSessionUser(),
    getDashboardTotalsQuery(),
    getOnboardingStatusQuery(),
  ]);
  const items = panelNavItemsFor(user?.role ?? "couple");
  return (
    <section className="flex flex-col gap-6">
      <PageHeading title="Bem-vindos ao painel" description="Tudo o que vocês precisam para cuidar da festa em um só lugar." align="start" />
      <ReviewTourButton className="w-fit border border-gold bg-card px-5 text-base hover:bg-blush" />
      <OnboardingCard status={onboarding} />
      <SuggestionsHomeCard />
      <DashboardTotalsGrid totals={totals} />
      <nav aria-label="Seções do painel">
        <ul className="grid gap-3 sm:grid-cols-2 lg:grid-cols-3">
          {items.map((item) => (
            <li key={item.href}>
              <Link
                href={item.href}
                className="flex min-h-11 items-center justify-between gap-2 rounded-xl border border-gold/50 bg-card px-4 py-3 text-lg transition-colors hover:bg-blush"
              >
                {item.label}
                <ChevronRight aria-hidden className="size-5 text-rose" />
              </Link>
            </li>
          ))}
        </ul>
      </nav>
    </section>
  );
}
