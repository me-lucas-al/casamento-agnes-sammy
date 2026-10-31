import { getSessionUser } from "@/modules/auth/controllers/session/get-session-user";
import { parsePageParams } from "@/shared/lib/pagination/pagination";
import { enumParam, textParam, type SearchParams } from "@/shared/lib/url/url-params";
import { getGuestModule } from "@/modules/guests/factory";
import { GUEST_SORTS } from "@/modules/guests/types";
import { guardedQuery } from "@/shared/lib/resilience/guarded-query";

export async function listGuestsPageQuery(searchParams: SearchParams) {
  return guardedQuery("listGuestsPageQuery", async () => {
    const actor = await getSessionUser();
    const pageParams = parsePageParams(searchParams);
    const search = textParam(searchParams, "search");
    const sort = enumParam(searchParams, "sort", GUEST_SORTS) ?? "recent";
    return getGuestModule().listGuestsPage(actor, { ...pageParams, search, sort });
  });
}
