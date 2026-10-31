import { getSessionUser } from "@/modules/auth/controllers/session/get-session-user";
import { parsePageParams } from "@/shared/lib/pagination";
import { enumParam, textParam, type SearchParams } from "@/shared/lib/url-params";
import { getUserModule } from "@/modules/users/factory";
import { USER_STATUSES } from "@/modules/users/types";
import { guardedQuery } from "@/shared/lib/guarded-query";

export async function listUsersPageQuery(searchParams: SearchParams) {
  return guardedQuery("listUsersPageQuery", async () => {
    const actor = await getSessionUser();
    const pageParams = parsePageParams(searchParams);
    const search = textParam(searchParams, "search");
    const status = enumParam(searchParams, "status", USER_STATUSES);
    return getUserModule().listUsersPage(actor, { ...pageParams, search, status });
  });
}
