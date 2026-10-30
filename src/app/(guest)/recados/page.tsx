import { getSessionUser } from "@/modules/auth/controllers/get-session-user";
import { ApprovedMessagesList } from "@/modules/messages/components/approved-messages-list";
import { MessageForm } from "@/modules/messages/components/message-form";
import { listApprovedMessagesQuery } from "@/modules/messages/controllers/messages.queries";
import type { SearchParams } from "@/shared/lib/url-params";
import { EmptyState } from "@/shared/ui/empty-state";
import { PaginationControls } from "@/shared/ui/pagination-controls";

export default async function MessagesPage({ searchParams }: { searchParams: Promise<SearchParams> }) {
  const resolvedSearchParams = await searchParams;
  const [actor, pageResult] = await Promise.all([getSessionUser(), listApprovedMessagesQuery(resolvedSearchParams)]);

  return (
    <div className="mx-auto flex max-w-xl flex-col gap-8">
      <h1 className="text-center text-3xl italic text-wine">Mural de recados</h1>
      {actor?.role === "guest" ? <MessageForm defaultAuthorName="" /> : null}
      {pageResult.items.length === 0 ? (
        <EmptyState title="Ainda não há recados" description="Seja o primeiro a deixar um carinho." />
      ) : (
        <ApprovedMessagesList messages={pageResult.items} />
      )}
      <PaginationControls basePath="/recados" searchParams={resolvedSearchParams} pageResult={pageResult} />
    </div>
  );
}
