import { MyContributionCard } from "@/modules/contributions/components/my-contribution-card";
import { listMyContributionsQuery } from "@/modules/contributions/controllers/contributions.queries";
import { EmptyState } from "@/shared/ui/empty-state";
import { PageHeading } from "@/shared/ui/components/page-heading";

export const dynamic = "force-dynamic";

export default async function MyGiftsPage() {
  const contributions = await listMyContributionsQuery();
  const now = new Date();

  return (
    <div className="mx-auto flex max-w-xl flex-col gap-4">
      <PageHeading title="Meus presentes" description="Os presentes que você reservou e os que os noivos já confirmaram." />
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
