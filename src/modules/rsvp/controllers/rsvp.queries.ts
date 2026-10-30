import { getSessionUser } from "@/modules/auth/controllers/get-session-user";
import { parsePageParams } from "@/shared/lib/pagination";
import { enumParam, textParam, type SearchParams } from "@/shared/lib/url-params";
import { getRsvpModule } from "../factory";
import { requireGuestId } from "../lib/require-guest-id";
import { RSVP_STATUSES } from "../types";
import { guardedQuery } from "@/shared/lib/guarded-query";

export async function getMyRsvpQuery() {
  return guardedQuery("getMyRsvpQuery", async () => {
    const actor = await getSessionUser();
    return getRsvpModule().getGuestRsvp(actor, requireGuestId(actor));
  });
}

export async function getRsvpTotalsQuery() {
  return guardedQuery("getRsvpTotalsQuery", async () => {
    const actor = await getSessionUser();
    return getRsvpModule().getRsvpTotals(actor);
  });
}

export async function listRsvpsPageQuery(searchParams: SearchParams) {
  return guardedQuery("listRsvpsPageQuery", async () => {
    const actor = await getSessionUser();
    return getRsvpModule().listRsvpsPage(actor, {
      ...parsePageParams(searchParams),
      status: enumParam(searchParams, "status", RSVP_STATUSES),
      search: textParam(searchParams, "search"),
    });
  });
}
