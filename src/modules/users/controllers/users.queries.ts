import { getSessionUser } from "@/modules/auth/controllers/get-session-user";
import { parsePageParams } from "@/shared/lib/pagination";
import { enumParam, textParam, type SearchParams } from "@/shared/lib/url-params";
import { getUserModule } from "../factory";
import { USER_STATUSES } from "../types";

export async function listUsersPageQuery(searchParams: SearchParams) {
  const actor = await getSessionUser();
  const pageParams = parsePageParams(searchParams);
  const search = textParam(searchParams, "search");
  const status = enumParam(searchParams, "status", USER_STATUSES);
  return getUserModule().listUsersPage(actor, { ...pageParams, search, status });
}
