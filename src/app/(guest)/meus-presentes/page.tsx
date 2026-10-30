import { MyContributionCard } from "@/modules/contributions/components/my-contribution-card";
import { listMyContributionsQuery } from "@/modules/contributions/controllers/contributions.queries";
import { EmptyState } from "@/shared/ui/empty-state";

export const dynamic = "force-dynamic";

export default async function MyGiftsPage() {
  const contributions = await listMyContributionsQuery();
  const now = new Date();

  return (
    <div className="mx-auto flex max-w-xl flex-col gap-4">
      <h1 className="font-serif text-3xl italic text-wine">Meus presentes</h1>
      {contributions.length === 0 ? (
        <EmptyState title="Você ainda não reservou nenhum presente." />
      ) : (
        <ul className="flex flex-col gap-3">
          {contributions.map((contribution) => (
            <MyContributionCard key={contribution.id} contribution={contribution} now={now} />
          ))}
        </ul>
      )}
    </div>
  );
}
