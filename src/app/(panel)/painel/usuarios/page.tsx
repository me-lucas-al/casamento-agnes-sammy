import { redirect } from "next/navigation";
import { hasRole } from "@/modules/auth/authorization";
import { getSessionUser } from "@/modules/auth/controllers/session/get-session-user";
import { CreateUserForm } from "@/modules/users/components/create-user-form";
import { UsersList } from "@/modules/users/components/users-list";
import { UsersToolbar } from "@/modules/users/components/users-toolbar";
import { listUsersPageQuery } from "@/modules/users/controllers/queries/users.queries";
import { USER_STATUSES } from "@/modules/users/types";
import { enumParam, textParam, type SearchParams } from "@/shared/lib/url/url-params";
import { EmptyState } from "@/shared/ui/feedback/empty-state";
import { PaginationControls } from "@/shared/ui/navigation/pagination-controls";
import { PageHeading } from "@/shared/ui/layout/page-heading";

type UsuariosPageProps = {
  searchParams: Promise<SearchParams>;
};

export default async function UsuariosPage({ searchParams }: UsuariosPageProps) {
  const actor = await getSessionUser();
  if (!hasRole(actor, ["admin"])) redirect("/painel");
  const params = await searchParams;
  const pageResult = await listUsersPageQuery(params);

  return (
    <div className="mx-auto grid max-w-4xl gap-6">
      <PageHeading title="Usuários" description="Quem pode entrar no painel dos noivos." align="start" />
      <CreateUserForm />
      <UsersToolbar search={textParam(params, "search")} status={enumParam(params, "status", USER_STATUSES)} />
      {pageResult.items.length === 0 ? (
        <EmptyState title="Nenhum usuário encontrado" />
      ) : (
        <UsersList users={pageResult.items} />
      )}
      <PaginationControls basePath="/painel/usuarios" searchParams={params} pageResult={pageResult} />
    </div>
  );
}
