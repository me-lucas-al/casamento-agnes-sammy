import { getSessionUser } from "@/modules/auth/controllers/get-session-user";
import { parsePageParams } from "@/shared/lib/pagination";
import { textParam, type SearchParams } from "@/shared/lib/url-params";
import { getUserModule } from "../factory";

export async function listUsersPageQuery(searchParams: SearchParams) {
  const actor = await getSessionUser();
  const pageParams = parsePageParams(searchParams);
  const search = textParam(searchParams, "search");
  return getUserModule().listUsersPage(actor, { ...pageParams, search });
}
