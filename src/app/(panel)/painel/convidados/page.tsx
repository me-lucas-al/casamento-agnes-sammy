import { redirect } from "next/navigation";
import { getSessionUser } from "@/modules/auth/controllers/get-session-user";
import { hasRole } from "@/modules/auth/authorization";
import { CreateGuestPanel } from "@/modules/guests/components/create-guest-panel";
import { GuestsTable } from "@/modules/guests/components/guests-table";
import { GuestsToolbar } from "@/modules/guests/components/guests-toolbar";
import { listGuestsPageQuery } from "@/modules/guests/controllers/guests.queries";
import { GUEST_SORTS } from "@/modules/guests/types";
import { getServerEnv } from "@/shared/config/env";
import { enumParam, textParam, type SearchParams } from "@/shared/lib/url-params";
import { EmptyState } from "@/shared/ui/empty-state";
import { PaginationControls } from "@/shared/ui/pagination-controls";
import { PageHeading } from "@/shared/ui/components/page-heading";

type ConvidadosPageProps = {
  searchParams: Promise<SearchParams>;
};

export default async function ConvidadosPage({ searchParams }: ConvidadosPageProps) {
  const actor = await getSessionUser();
  if (!hasRole(actor, ["admin", "couple"])) redirect("/entrar");
  const params = await searchParams;
  const pageResult = await listGuestsPageQuery(params);

  return (
    <div className="mx-auto grid max-w-5xl gap-6">
      <PageHeading title="Convidados" description="Cadastre quem vai celebrar com a gente e envie o código de acesso." align="start" />
      <CreateGuestPanel />
      <GuestsToolbar
        search={textParam(params, "search")}
        sort={enumParam(params, "sort", GUEST_SORTS) ?? "recent"}
      />
      {pageResult.items.length === 0 ? (
        <EmptyState title="Nenhum convidado encontrado" description="Adicione um convidado ou ajuste a busca." />
      ) : (
        <GuestsTable guests={pageResult.items} baseUrl={getServerEnv().APP_URL} />
      )}
      <PaginationControls basePath="/painel/convidados" searchParams={params} pageResult={pageResult} />
    </div>
  );
}
