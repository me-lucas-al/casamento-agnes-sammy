import { redirect } from "next/navigation";
import { hasRole } from "@/modules/auth/authorization";
import { getSessionUser } from "@/modules/auth/controllers/get-session-user";
import { ModerationQueue } from "@/modules/gallery/components/moderation-queue";
import { StatusFilter } from "@/modules/gallery/components/status-filter";
import { listPhotosPanelQuery } from "@/modules/gallery/controllers/gallery.queries";
import { PHOTO_STATUSES } from "@/modules/gallery/types";
import { enumParam, type SearchParams } from "@/shared/lib/url-params";
import { EmptyState } from "@/shared/ui/empty-state";
import { PaginationControls } from "@/shared/ui/pagination-controls";

type FotosPageProps = {
  searchParams: Promise<SearchParams>;
};

export default async function FotosPage({ searchParams }: FotosPageProps) {
  const actor = await getSessionUser();
  if (!hasRole(actor, ["admin", "couple"])) redirect("/entrar");
  const params = await searchParams;
  const pageResult = await listPhotosPanelQuery(params);

  return (
    <div className="mx-auto grid max-w-5xl gap-6 px-4 py-6">
      <h1 className="font-heading text-3xl text-wine">Fotos</h1>
      <StatusFilter
        basePath="/painel/fotos"
        searchParams={params}
        activeStatus={enumParam(params, "status", PHOTO_STATUSES)}
      />
      {pageResult.items.length === 0 ? (
        <EmptyState title="Nenhuma foto encontrada" description="Ajuste o filtro de status." />
      ) : (
        <ModerationQueue photos={pageResult.items} />
      )}
      <PaginationControls basePath="/painel/fotos" searchParams={params} pageResult={pageResult} />
    </div>
  );
}
