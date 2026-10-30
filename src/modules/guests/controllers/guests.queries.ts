import { getSessionUser } from "@/modules/auth/controllers/get-session-user";
import { parsePageParams } from "@/shared/lib/pagination";
import { enumParam, textParam, type SearchParams } from "@/shared/lib/url-params";
import { getGuestModule } from "../factory";
import { GUEST_SORTS } from "../types";

export async function listGuestsPageQuery(searchParams: SearchParams) {
  const actor = await getSessionUser();
  const pageParams = parsePageParams(searchParams);
  const search = textParam(searchParams, "search");
  const sort = enumParam(searchParams, "sort", GUEST_SORTS) ?? "recent";
  return getGuestModule().listGuestsPage(actor, { ...pageParams, search, sort });
}
